import { config } from "dotenv";
config();
import HttpServer from "./server/server";

const server = new HttpServer();
server.serve();
