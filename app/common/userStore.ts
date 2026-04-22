export class UserStore<k, v> {
    private store: Map<k, v>;
    constructor() {
        this.store = new Map();
    }

    get(k: k) { return this.store.get(k); }
    set(k: k, v: v) { return this.store.set(k, v); }
    del(k: k) { return this.store.delete(k); }
    rootExists(key: keyof v, value: string) {
        return Array.from(this.store.values()).find(e => e[key] === value);
    }
    getKeys() { return Array.from(this.store.keys()); }
}