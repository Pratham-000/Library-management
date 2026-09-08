import app from "./app";
import http from "http";
import { initSockets } from "./sockets";

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
initSockets(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});