import * as net from "net";
import { config } from "dotenv";

config({ path: ".env" });

const port = process.env.PORT || 6379;

console.log("Logs from your program will appear here!");

const server: net.Server = net.createServer((socketConn: net.Socket) => {

    socketConn.on("data", (d: Buffer) => {
        console.log(d, d.toString("utf-8"));
        socketConn.write("+PONG\r\n");
    });


});

server.listen(port);
