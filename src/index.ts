import express from "express";

import router from "./routes";
import config from "./config";
import { genericErrorHandler } from "./middlewares/error_handler";
import { requestLogger } from "./middlewares/logger";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import cors from "cors";

const app = express();
// rate - limiter configuration
const limiter = rateLimiter({
  windowMs: 60 * 1000, // 60,000 milliseconds
  limit: 10, // 10 requests per 60 seconds per each IP
  message: "Too many requests made.", // message on limit exceed
});

// protect the application from web vulnerabilities
app.use(helmet());

// make use of limiter
// app.use(limiter);

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use(router);

// pass error handling middleware
app.use(genericErrorHandler);

// listen for connections on host/port
app.listen(config.port, () => {
  console.log(`Server started listening on port: ${config.port}`);
});
