import dotenv from "dotenv";
dotenv.config();
import http from "http";
import fs from "fs";

const ROOT = process.env.ROOT_DIR;

export default class HttpServer {
    private address: string;
    private port: number;
    private server: http.Server;

    constructor(address: string = "localhost", port: number = 5173) {
        this.address = address;
        this.port = port;
        this.server = http.createServer(this.requestHandler.bind(this));
    }

    public serve() {
        this.server.listen(this.port, this.address);
    }

    private requestHandler(
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) {
        switch (req.method) {
            case "GET":
                this.handleGetRequest(req, res);
                break;
            default:
                this.handleBadRequest(res);
        }
    }

    private handleGetRequest(
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) {
        if (req.url?.endsWith(".ico") || req.url?.endsWith(".png")) {
            this.handleFaviconRequest(req, res);
            return;
        }

        if (req.url?.endsWith(".css")) {
            this.handleCssRequest(req, res);
            return;
        }

        if (req.url?.endsWith(".js") || req.url?.endsWith(".js.map")) {
            this.handleJsRequest(req, res);
            return;
        }

        this.handleHtmlRequest(req, res);
    }

    private handleBadRequest(res: http.ServerResponse) {
        res.statusCode = 400;
        res.end("<h1>Bad request</h1>");
    }

    private handle404(res: http.ServerResponse) {
        res.writeHead(404, { "Content-Type": "text/html" });
        fs.createReadStream(this.getHtml("/404")).pipe(res);
    }

    private handleFaviconRequest(
        req: http.IncomingMessage,
        res: http.ServerResponse) {
        const readStream = fs.createReadStream(this.getPath(req.url));
        readStream.on("error", () => {
            this.handle404(res);
        });
        readStream.on("ready", () => {
            res.writeHead(200, { "Content-Type": "image/png" });
            readStream.pipe(res);
        });
    }

    private handleHtmlRequest(
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) {
        const readStream = fs.createReadStream(this.getHtml(req.url));
        readStream.on("error", () => {
            this.handle404(res);
        });
        readStream.on("ready", () => {
            res.writeHead(200, { "Content-Type": "text/html" });
            readStream.pipe(res);
        });
    }

    private handleCssRequest(
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) {
        const readStream = fs.createReadStream(this.getPath(req.url));
        readStream.on("error", () => {
            this.handle404(res);
        });
        readStream.on("ready", () => {
            res.writeHead(200, { "Content-Type": "text/css" });
            readStream.pipe(res);
        });
    }

    private handleJsRequest(
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) {
        const readStream = fs.createReadStream(this.getJs(req.url));
        readStream.on("error", () => {
            this.handle404(res);
        });
        readStream.on("ready", () => {
            res.writeHead(200, { "Content-Type": "text/javascript" });
            readStream.pipe(res);
        });
    }

    private getHtml(url: string | undefined): string {
        const path = url === undefined || url === "/" ? "index" : url?.slice(1);
        return `${ROOT}/public/${path}.html`;
    }

    private getJs(url: string | undefined): string {
        const path = url?.slice(1);
        return `${ROOT}/dist/src/${path}`;
    }

    private getPath(url: string | undefined): string {
        const path = url?.slice(1);
        return `${ROOT}/public/${path}`;
    }
}
