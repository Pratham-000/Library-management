import cors from "cors";
import express from "express";
import routes from "./routes/index";
import { errorHandler } from "./middleware/errorHadler.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

export default app;