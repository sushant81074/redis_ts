import { DataStore, StreamStore } from "../common/dataStore";
import { NetConnStore } from "../common/netSocketStore";
import type { TConnCmd, TConnMapData, TStreamValue, TUser, TValue } from "../interfaces";
import { isExpired, calRemainingTime } from "../services/data";
import { UserStore } from "../common/userStore";

export const DATA: DataStore<string, TValue> = new DataStore(100, isExpired, calRemainingTime);
export const STREAMS: StreamStore<string, TStreamValue> = new StreamStore(100, isExpired, calRemainingTime);
export const NET_CONN: NetConnStore<string, TConnMapData[]> = new NetConnStore(100);
export const USERS: UserStore<string, TUser> = new UserStore();
export const CONN_CMDS: Map<string, TConnCmd> = new Map();