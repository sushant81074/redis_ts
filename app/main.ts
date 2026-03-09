import * as net from "net";
import { config } from "dotenv";

config({ path: ".env" });

const port = process.env.PORT || 6379;

console.log("Logs from your program will appear here!");

const server: net.Server = net.createServer((socketConn: net.Socket) => {

    socketConn.on("data", (d: Buffer) => {
        let data = d.toString("utf-8");
        console.log(data);
        socketConn.write("+PONG\r\n");
    });

    socketConn.on("close", (e: boolean) => console.log("connection closed ?", e));
    socketConn.on("error", (e: Error) => console.log("error occured", e));

});

server.listen(port);
