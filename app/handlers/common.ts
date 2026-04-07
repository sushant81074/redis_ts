import * as net from "net";
import { ETtlType } from "../interfaces";
import { calRemainingTime } from "../services/data";
import { CONN_CMDS, DATA } from "../cache/data";
import { onData } from "../controllers";

export const setExpiry = (conn: net.Socket, [k, t]: string[]) => {
    const v = DATA.get(k);
    if (!v || !v.v) { conn.write(0 + "\r\n"); return; }
    v.ttl = t;
    v.ttlType = ETtlType.EX;
    DATA.set(k, v);
    conn.write(1 + "\r\n");
    return;
};

export const setPExpiry = (conn: net.Socket, [k, t]: string[]) => {
    const v = DATA.get(k);
    if (!v || !v.v) { conn.write(0 + "\r\n"); return; }
    v.ttl = t;
    v.ttlType = ETtlType.PX;
    DATA.set(k, v);
    conn.write(1 + "\r\n");
    return;
};

export const getTtl = (conn: net.Socket, [k]: string[]) => {
    const v = DATA.get(k);
    console.log({ v });
    if (!v || !Object.keys(v).length) { conn.write(-2 + "\r\n"); return; }
    if (!v?.ttl || v?.ttlType == ETtlType.NONE) { conn.write(-1 + "\r\n"); return; }
    let remainingTime = (calRemainingTime(v) / 1000);
    if (remainingTime <= 0) {
        DATA.del(k);
        conn.write(-2 + "\r\n"); return;
    }
    conn.write(remainingTime.toFixed(2) + "\r\n");
    return;
};

export const getPTtl = (conn: net.Socket, [k]: string[]) => {
    const v = DATA.get(k);
    if (!v || !Object.keys(v).length) { conn.write(-2 + "\r\n"); return; }
    if (!v?.ttl || v?.ttlType == ETtlType.NONE) { conn.write(-1 + "\r\n"); return; }
    const remainingTime = calRemainingTime(v);
    if (remainingTime <= 0) {
        DATA.del(k);
        conn.write(-2 + "\r\n"); return;
    }
    conn.write(remainingTime + "\r\n");
    return;
};

export const getType = (conn: net.Socket, [k]: string[]) => {
    const v = DATA.get(k);
    if (!v || !Object.keys(v).length) { conn.write("+none\r\n"); return; }
    if (v.ttl && v.ttlType != ETtlType.NONE && calRemainingTime(v) <= 0) {
        DATA.del(k);
        conn.write("+none\r\n"); return;
    }
    conn.write(v.dType + "\r\n");
    return;
};

export const multi = (conn: net.Socket) => {
    CONN_CMDS.set(`${conn.remoteAddress}:${conn.remotePort}`, { conn, cmds: [] });
    conn.write("OK\r\n");
    return;
};

export const cmdStore = (conn: net.Socket, cmd: Buffer) => {
    let connAddress = `${conn.remoteAddress}:${conn.remotePort}`;
    const cmdStoreData = CONN_CMDS.get(connAddress);
    if (!(cmdStoreData?.conn instanceof net.Socket)) {
        conn.write("\r\n");
        return;
    }
    cmdStoreData.cmds.push(cmd);
    CONN_CMDS.set(connAddress, cmdStoreData);
    conn.write("QUEUED\r\n");
    return;
};

export const exec = (conn: net.Socket) => {
    let connAddress = `${conn.remoteAddress}:${conn.remotePort}`;
    const cmdStoreData = CONN_CMDS.get(connAddress);
    if (!(cmdStoreData?.conn instanceof net.Socket)) {
        conn.write("\r\n");
        return;
    }
    for (const [idx, cmd] of cmdStoreData.cmds.entries()) {
        onData(conn, cmd);
        cmdStoreData.cmds.splice(idx, 1);
    }
    CONN_CMDS.delete(connAddress);
    conn.write("exec done!\r\n");

    return;
};