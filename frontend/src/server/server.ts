import http from "http";
import fs from "fs";

const ROOT = `${process.env.ROOT_DIR}/public`;

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
        this.server.listen(this.port, this.address, () => {});
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
        if (req.url === "/favicon.ico") {
            this.handleFaviconRequest(res);
        } else {
            const readStream = fs.createReadStream(this.getUrl(req.url));
            readStream.on("error", () => {
                res.writeHead(404, { "Content-Type": "text/html" });
                this.handle404(res);
            });
            readStream.on("ready", () => {
                res.writeHead(200, { "Content-Type": "text/html" });
                readStream.pipe(res);
            });
        }
    }

    private handleBadRequest(res: http.ServerResponse) {
        res.statusCode = 400;
        res.end("<h1>Bad request</h1>");
    }

    private handle404(res: http.ServerResponse) {
        fs.createReadStream(this.getUrl("/404")).pipe(res);
    }

    private handleFaviconRequest(res: http.ServerResponse) {
        const faviconPath = `${ROOT}/favicon.ico`;
        const readStream = fs.createReadStream(faviconPath);
        readStream.on("error", () => {
            res.writeHead(404, { "Content-Type": "text/html" });
            this.handle404(res);
        });
        readStream.on("end", () => {
            res.writeHead(200, { "Content-Type": "image/x-icon" });
            readStream.pipe(res);
        });
    }

    private getUrl(url: string | undefined): string {
        const path = url === undefined || url === "/" ? "index" : url?.slice(1);
        return `${ROOT}/${path}.html`;
    }
}
