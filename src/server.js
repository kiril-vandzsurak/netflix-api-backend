import express from "express";
import listEndpoints from "express-list-endpoints";

const server = express();
const port = process.env.PORT;
server.use(express.json());

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
