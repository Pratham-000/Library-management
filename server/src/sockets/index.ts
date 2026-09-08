import { Server } from "socket.io";
import http from "http";
import { registerRoomHandlers } from "./room.handler";
import { registerTimerHandlers } from "./timer.handler";

export const initSockets = (server: http.Server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    registerRoomHandlers(io, socket);
    registerTimerHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};