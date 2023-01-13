import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const mediaRouter = express.Router();

const movieJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/movie.json"
);

mediaRouter.get("/", (req, res, next) => {
  const fileContent = fs.readFileSync(movieJSONPath);
  const movies = JSON.parse(fileContent);
  res.send(movies);
});
export default mediaRouter;
