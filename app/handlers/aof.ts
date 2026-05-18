/* 
import * as fs from 'fs';
import * as  fsAsync from "fs/promises";
import * as readline from "readline";
import { aofDir, aofPath, aofSnapshotPath, aofTempPath, EAFsync, EAOnly, type TAOFStates, type TAuthenticConn, type TSetAOFKey, type TSetAOFVal } from '../interfaces';
import { onData } from '../controllers';
import { DATA, STREAMS, USERS } from '../cache/data';

export class AOF {
    private aofStates: TAOFStates;
    wStream!: fs.WriteStream;
    tempStream!: fs.WriteStream;
    rStream!: fs.ReadStream;
    fd!: number;
    vc: TAuthenticConn;
    isRewriteInProgress: boolean;
    loadInProgress: boolean;
    aofSize: number;
    setAbles: string[];

    constructor(aofDir: string, aofPath: string, aofTempPath: string, aofSnapshotPath: string) {

        this.isRewriteInProgress = false;
        this.loadInProgress = false;
        this.aofStates = {
            aofpath: aofPath,
            aoftemppath: aofTempPath,
            aofdir: aofDir,
            aofsnapshotpath: aofSnapshotPath,
            appendonly: EAOnly.NO,
            appendfsync: EAFsync.ALWAYS,
            autoaofrewritepercentage: 100,
            autoaofrewriteminsize: 64 * 1024 * 1024,
        };
        this.setAbles = Object.keys(this.aofStates).map(e => e.toLowerCase());
        this.initAOF(this.aofStates.aofpath, this.aofStates.aofdir, "wStream");
        this.vc = this.initVC();
        this.aofSize = fs.statSync(this.aofStates.aofpath).size || 0;
    }

    initAOF(aofPath: string, aofDir: string, stream: "wStream" | "tempStream") {
        if (!fs.existsSync(aofDir)) fs.mkdirSync(aofDir, { recursive: true });
        if (!fs.existsSync(aofPath)) fs.writeFileSync(aofPath, "");

        this[stream] = fs.createWriteStream(aofPath, { flags: "a" });
        this[stream].on("open", (fd) => { this.fd = fd; console.log("wStream opened"); });
        this[stream].on("drain", () => console.warn("stream draning"));
        this[stream].on("close", () => console.warn("stream closed"));
        this[stream].on("error", (err) => console.error(err));
    }

    initVC() {
        return {
            write: (_: any) => { },
            pause: () => { },
            resume: () => { },
            destroy: () => { },
            end: () => { },
            remoteAddress: "127.0.0.1",
            remotePort: 0,
            isAuthentic: true,
            user: "default"
        } as TAuthenticConn;
    }

    getAOFStates = (p: TSetAOFKey) => this.aofStates[p];
    getProperty = (p: keyof AOF) => this[p];

    setProperty<k extends TSetAOFKey>(conn: TAuthenticConn, [p, v]: [k, TSetAOFVal]) {
        if (p.includes("-")) p = p.split("-").join("") as k;

        if (!this.setAbles.includes(p)) {
            conn.write("-ERR Invalid AOF property\r\n");
            return;
        }

        let parsedVal: any = null;

        switch (p) {
            case "appendonly":
                if (![EAOnly.YES, EAOnly.NO].includes(v as EAOnly)) {
                    conn.write("-ERR appendonly must be yes|no\r\n");
                    return;
                }
                parsedVal = v;
                break;

            case "appendfsync":
                if (![EAFsync.ALWAYS, EAFsync.EVERYSEC, EAFsync.NO].includes(v as EAFsync)) {
                    conn.write("-ERR appendfsync must be always|everysec|no\r\n");
                    return;
                }
                parsedVal = v;
                break;

            case "autoaofrewritepercentage":
                if (isNaN(Number(v)) || Number(v) < 0) {
                    conn.write("-ERR percentage must be a positive number\r\n");
                    return;
                }
                parsedVal = Number(v);
                break;

            case "autoaofrewriteminsize":
                if (isNaN(Number(v)) || Number(v) < 0) {
                    conn.write("-ERR min size must be a positive number\r\n");
                    return;
                }
                parsedVal = Number(v);
                break;

            case "aofpath":
            case "aofdir":
                parsedVal = String(v);
                break;

            default:
                conn.write("-ERR Unsupported property\r\n");
                return;
        }

        this.aofStates[p] = parsedVal;
        conn.write("OK\r\n");
    }

    async writeToAOF(cmd: string) {

        this.wStream.write(cmd + "\n");

        if (this.aofStates.appendfsync == EAFsync.ALWAYS) this.fsync();
        else if (this.aofStates.appendfsync == EAFsync.EVERYSEC) this.everySec();

        this.aofSize += Buffer.byteLength(cmd + "\n");
        if (!this.isRewriteInProgress && this.shouldRewrite()) await this.rewriteAOF();
        return;
    }

    private fsync() {
        return fs.fsync(this.fd, () => console.log("fsynced"));
    }

    private everySec() {
        return setTimeout(this.fsync.bind(this), 1000);
    }

    loadAOF() {
        this.loadInProgress = true;
        this.rStream = fs.createReadStream(this.aofStates.aofpath, { encoding: "utf-8" });
        const rl = readline.createInterface({ input: this.rStream, crlfDelay: Infinity });

        rl.on("line", (l) => {
            l = l.trim();
            if (!l) return;
            onData(this.vc, Buffer.from(l));
        });
        rl.on("close", () => this.loadInProgress = false);
        rl.on("error", (err) => {
            console.error("AOF read error:", err);
            this.loadInProgress = false;
        });
    }

    private shouldRewrite() {
        if (this.aofSize < this.aofStates.autoaofrewriteminsize) return false;
        const growth = (this.aofSize / this.aofStates.autoaofrewriteminsize) * 100;
        return growth >= (100 + this.aofStates.autoaofrewritepercentage);
    }

    private async rewriteAOF() {
        this.isRewriteInProgress = true;
        try { await fsAsync.writeFile(aofSnapshotPath, JSON.stringify({ DATA, STREAMS, USERS }), { encoding: "utf-8" }); }
        catch (error) { console.error("error occured during snapshoting", error); }
        this.isRewriteInProgress = false;
        return;
    }
}

export const aof = new AOF(aofDir, aofPath, aofTempPath, aofSnapshotPath);

*/

import * as fs from 'fs';
import * as fsAsync from 'fs/promises';
import * as readline from 'readline';

import { aofDir, aofPath, aofSnapshotPath, aofTempPath, EAFsync, EAOnly, type TAOFStates, type TAuthenticConn, type TSetAOFKey, type TSetAOFVal } from '../interfaces';

import { onData } from '../controllers';
import { DATA, STREAMS, USERS } from '../cache/data';

export class AOF {

    private aofStates: TAOFStates;

    wStream!: fs.WriteStream;
    tempStream!: fs.WriteStream;
    rStream!: fs.ReadStream;

    fd!: number;

    vc: TAuthenticConn;

    isRewriteInProgress: boolean;
    loadInProgress: boolean;

    aofSize: number;

    setAbles: string[];

    constructor(aofDir: string, aofPath: string, aofTempPath: string, aofSnapshotPath: string) {

        this.isRewriteInProgress = false;
        this.loadInProgress = false;

        this.aofStates = {
            aofpath: aofPath,
            aoftemppath: aofTempPath,
            aofdir: aofDir,
            aofsnapshotpath: aofSnapshotPath,
            appendonly: EAOnly.NO,
            appendfsync: EAFsync.ALWAYS,
            autoaofrewritepercentage: 100,
            autoaofrewriteminsize: 64 * 1024 * 1024,
        };

        this.setAbles = Object.keys(this.aofStates).map(e => e.toLowerCase());
        this.initAOF(this.aofStates.aofpath, this.aofStates.aofdir, 'wStream');
        this.vc = this.initVC();
        this.aofSize = fs.existsSync(this.aofStates.aofpath) ? fs.statSync(this.aofStates.aofpath).size : 0;
    }

    initAOF(aofPath: string, aofDir: string, stream: 'wStream' | 'tempStream') {

        if (!fs.existsSync(aofDir)) {
            fs.mkdirSync(aofDir, { recursive: true });
        }

        if (!fs.existsSync(aofPath)) {
            fs.writeFileSync(aofPath, '');
        }

        this[stream] = fs.createWriteStream(aofPath, {
            flags: 'a'
        });

        this[stream].on('open', (fd) => {
            this.fd = fd;
            console.log(`${stream} opened`);
        });

        this[stream].on('drain', () => {
            console.warn(`${stream} draining`);
        });

        this[stream].on('close', () => {
            console.warn(`${stream} closed`);
        });

        this[stream].on('error', (err) => {
            console.error(err);
        });
    }

    initVC() {

        return {
            write: (_: any) => { },
            pause: () => { },
            resume: () => { },
            destroy: () => { },
            end: () => { },
            remoteAddress: '127.0.0.1',
            remotePort: 0,
            isAuthentic: true,
            user: 'default'
        } as TAuthenticConn;
    }

    getAOFStates = (p: TSetAOFKey) => this.aofStates[p];

    getProperty = (p: keyof AOF) => this[p];

    setProperty<k extends TSetAOFKey>(
        conn: TAuthenticConn,
        [p, v]: [k, TSetAOFVal]
    ) {

        if (p.includes('-')) {
            p = p.split('-').join('') as k;
        }

        if (!this.setAbles.includes(p)) {
            conn.write('-ERR Invalid AOF property\r\n');
            return;
        }

        let parsedVal: any = null;

        switch (p) {

            case 'appendonly':

                if (![EAOnly.YES, EAOnly.NO].includes(v as EAOnly)) {
                    conn.write('-ERR appendonly must be yes|no\r\n');
                    return;
                }

                parsedVal = v;
                break;

            case 'appendfsync':

                if (
                    ![
                        EAFsync.ALWAYS,
                        EAFsync.EVERYSEC,
                        EAFsync.NO
                    ].includes(v as EAFsync)
                ) {
                    conn.write('-ERR appendfsync must be always|everysec|no\r\n');
                    return;
                }

                parsedVal = v;
                break;

            case 'autoaofrewritepercentage':

                if (isNaN(Number(v)) || Number(v) < 0) {
                    conn.write('-ERR percentage must be positive\r\n');
                    return;
                }

                parsedVal = Number(v);
                break;

            case 'autoaofrewriteminsize':

                if (isNaN(Number(v)) || Number(v) < 0) {
                    conn.write('-ERR min size must be positive\r\n');
                    return;
                }

                parsedVal = Number(v);
                break;

            case 'aofpath':
            case 'aofdir':

                parsedVal = String(v);
                break;

            default:

                conn.write('-ERR Unsupported property\r\n');
                return;
        }

        this.aofStates[p] = parsedVal;

        conn.write('OK\r\n');
    }

    async writeToAOF(cmd: string) {

        const line = cmd + '\n';

        if (this.isRewriteInProgress) {

            if (!this.tempStream) {
                this.initAOF(
                    this.aofStates.aoftemppath,
                    this.aofStates.aofdir,
                    'tempStream'
                );
            }

            this.tempStream.write(line);

        } else {

            this.wStream.write(line);
        }

        if (this.aofStates.appendfsync === EAFsync.ALWAYS) {
            this.fsync();
        }

        else if (this.aofStates.appendfsync === EAFsync.EVERYSEC) {
            this.everySec();
        }

        this.aofSize += Buffer.byteLength(line);

        if (
            !this.isRewriteInProgress &&
            this.shouldRewrite()
        ) {
            this.rewriteAOF();
        }
    }

    private fsync() {

        if (!this.fd) return;

        fs.fsync(this.fd, () => {
            console.log('fsynced');
        });
    }

    private everySec() {

        setTimeout(() => {
            this.fsync();
        }, 1000);
    }

    loadAOF() {

        this.loadInProgress = true;

        this.rStream = fs.createReadStream(
            this.aofStates.aofpath,
            {
                encoding: 'utf-8'
            }
        );

        const rl = readline.createInterface({
            input: this.rStream,
            crlfDelay: Infinity
        });

        rl.on('line', (l) => {

            l = l.trim();

            if (!l) return;

            onData(this.vc, Buffer.from(l));
        });

        rl.on('close', () => {
            this.loadInProgress = false;
        });

        rl.on('error', (err) => {

            console.error('AOF read error:', err);

            this.loadInProgress = false;
        });
    }

    private shouldRewrite() {

        if (
            this.aofSize <
            this.aofStates.autoaofrewriteminsize
        ) {
            return false;
        }

        const growth =
            (this.aofSize /
                this.aofStates.autoaofrewriteminsize) * 100;

        return (
            growth >=
            (100 + this.aofStates.autoaofrewritepercentage)
        );
    }

    private async rewriteAOF() {

        this.isRewriteInProgress = true;

        try {

            await fsAsync.writeFile(
                this.aofStates.aofsnapshotpath,
                JSON.stringify({
                    DATA,
                    STREAMS,
                    USERS
                }),
                {
                    encoding: 'utf-8'
                }
            );

            await new Promise<void>((resolve) => {
                this.wStream.end(() => resolve());
            });

            await fsAsync.copyFile(
                this.aofStates.aoftemppath,
                this.aofStates.aofpath
            );

            await fsAsync.truncate(
                this.aofStates.aoftemppath,
                0
            );

            this.initAOF(
                this.aofStates.aofpath,
                this.aofStates.aofdir,
                'wStream'
            );

            if (this.tempStream) {
                this.tempStream.destroy();
            }

        } catch (error) {

            console.error(
                'error occured during rewrite',
                error
            );

        } finally {

            this.isRewriteInProgress = false;
        }
    }
}

export const aof = new AOF(
    aofDir,
    aofPath,
    aofTempPath,
    aofSnapshotPath
);