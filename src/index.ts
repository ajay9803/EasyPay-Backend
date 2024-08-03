import express from "express";

import router from "./routes";
import config from "./config";
import { genericErrorHandler } from "./middlewares/error_handler";
import { requestLogger } from "./middlewares/logger";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import cors from "cors";
import http from "http";
import { Socket, Server as SocketIo } from "socket.io";
import { SocketModel } from "./models/socket";

const app = express();

// Rate - limiter configuration
const limiter = rateLimiter({
  windowMs: 60 * 1000, // 60,000 milliseconds
  limit: 10, // 10 requests per 60 seconds per each IP
  message: "Too many requests made.", // message on limit exceed
});

// Protects the application from web vulnerabilities
app.use(helmet());

// Make use of limiter
// app.use(limiter);

const server = http.createServer(app);

app.use(cors());
export const io = new SocketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

// Log request-method and request-url for easy debugging
app.use(requestLogger);

// Pass router
app.use(router);

// Pass error handling middleware
app.use(genericErrorHandler);

io.on("connection", (socket: Socket) => {
  socket.on("balance-transfer", async ({ userId, amount, message }) => {
    await SocketModel.fetchSocket(userId)
      .then((userSocket) => {
        if (userSocket) {
          io.to(userSocket.socketId).emit("balance-transfer", {
            amount,
            message,
          });
        } else {
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Listen for connections on host/port
server.listen(config.port, () => {
  console.log(`Server started listening on port: ${config.port}`);
});
