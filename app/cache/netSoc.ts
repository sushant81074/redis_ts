import type { TConnMap, TConnMapData } from "../interfaces";

export const CONN_MAP: TConnMap = new Map();

export const get = (k: string) => CONN_MAP.get(k);
export const set = (k: string, v: TConnMapData) => {

    const arr = CONN_MAP.get(k);
    if (!Array.isArray(arr)) {
        CONN_MAP.set(k, [v]);
    } else {
        arr.push(v);
        CONN_MAP.set(k, arr);
    }

    return;
};
export const del = (k: string) => CONN_MAP.delete(k);
export const getKeys = () => CONN_MAP.keys();

export const connExpiryLoop = () => {
    getKeys().forEach(k => {
        const vs = get(k);
        if (!vs || !vs.length) return;
        vs.forEach(v => {
            if (!v || !v.conn || Number(v.timeout) == 0) return;
            if (!isNaN(Number(v.timeout)) && Date.now() - (Number(v.timeout) * 1000) > v.at) {
                v.conn.resume();
                v.conn.write("nil\r\n");
                del(k);
            }
        });
    });

};
