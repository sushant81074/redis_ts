import type { TValue } from "../interfaces";
import { isExpired } from "../services/data";

export const DATA_MAP: Map<string, TValue> = new Map();

export const get = (k: string) => DATA_MAP.get(k);
export const set = (k: string, v: TValue) => DATA_MAP.set(k, v);
export const del = (k: string) => DATA_MAP.delete(k);
export const getKeys = () => DATA_MAP.keys();

export const dataExpiryLoop = () => {
    getKeys().forEach(k => {
        const v = get(k);
        if (!v?.v) return;
        if (!!v.ttl && !!v.ttlType) {
            const expired = isExpired(v);
            if (expired) del(k);
        }
    });
};