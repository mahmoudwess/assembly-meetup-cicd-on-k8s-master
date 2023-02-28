import * as express from "express";
import * as http from "http";
import * as cors from "cors";

const app = express();
let server;
let port;

server = http.createServer(app);
port = process.env.port || 5000;
const io = require("socket.io")(server);

const roomsMap = {};
const RoomService = require("./RoomService")(io, roomsMap);
const cwd = process.cwd();
io.sockets.on("connection", RoomService.listen);
io.sockets.on("error", e => console.log(e));
app.use(cors());
app.use(express.static(cwd + "/dist/ui"));
app.get("*", function(req, res) {
  res.sendFile(`${cwd}/dist/ui/index.html`);
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
