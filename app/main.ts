import * as net from "net";
import { config } from "dotenv";

config({ path: ".env" });

const port = process.env.PORT || 6379;

console.log("Logs from your program will appear here!");

const server: net.Server = net.createServer((socketConn: net.Socket) => {




});

server.listen(port);
