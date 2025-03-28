import { Server } from "socket.io";

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  try {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`New client connected: ${socket.id}`);

      socket.on("send_message", (msg) => {
        console.log(`Message received from ${socket.id}: ${msg}`);
        io.emit("receive_message", { id: socket.id, message: msg });
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      socket.on("error", (error) => {
        console.error(`Error from client ${socket.id}:`, error);
      });
    });

    console.log("Socket is initialized");
    res.end();
  } catch (error) {
    console.error("Socket initialization error:", error);
    res.status(500).end();
  }
};

export default SocketHandler;
