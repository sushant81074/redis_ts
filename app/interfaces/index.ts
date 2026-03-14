import * as net from "net";
import { type DoublyLinkedList } from "../services/doublyLinkedList";

export const tokens = ["px", "ex", "nx", "xx", "pxat", "exat", "echo", "set", "get", "nil", "expiry", "pexpiry", "ttl", "pttl", "sleep", "rpush", "rpop", "lpush", "lpop", "lrange", "llen", "blpop", "brpop"];

export const enum EXNMode { NX = "nx", XX = "xx" }
export const enum ETtlType { PX = "px", EX = "ex", NONE = "none", PXAT = "pxat", EXAT = "exat" };

export type TValTypes = string | DoublyLinkedList;
export type TValue = { v: TValTypes, ttl: string, ttlType: ETtlType, at: number; };
export type TSetCmd = [string, string, ETtlType & EXNMode, string, EXNMode];
export type TSleepCmd = [string, string, string, ...TSetCmd];

export const enum EListCmdMode { RIGHTS = "r", LEFTS = "l" };
export type TConnMapData = { conn: net.Socket; timeout: number; at: number; };
export type TConnMap = Map<string, TConnMapData[]>;
