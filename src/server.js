import express from "express";
import listEndpoints from "express-list-endpoints";
import mediaRouter from "./api/media/index.js";

const server = express();
const port = process.env.PORT;
server.use(express.json());

server.use("/media", mediaRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
