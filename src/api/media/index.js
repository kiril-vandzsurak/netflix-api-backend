import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getPdfReadStream } from "../../lib/pdf-tools.js";

const mediaRouter = express.Router();

const movieJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/movie.json"
);

mediaRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(movieJSONPath);
  const movies = JSON.parse(fileContent);
  res.send(movies);
});

mediaRouter.post("/", (req, res) => {
  const newMovie = { ...req.body, createdAt: new Date(), imdbID: uniqid() };
  const movieArr = JSON.parse(fs.readFileSync(movieJSONPath));
  movieArr.push(newMovie);
  fs.writeFileSync(movieJSONPath, JSON.stringify(movieArr));
  res.status(201).send({ id: newMovie.id });
});

// mediaRouter.post("/:id/poster", (req, res) => {
//   const newMovie = { ...req.body};
//   const movieArr = JSON.parse(fs.readFileSync(movieJSONPath));
//   movieArr.push(newMovie);
//   fs.writeFileSync(movieJSONPath, JSON.stringify(movieArr));
//   res.status(201).send({ id: newMovie.id });
// });

mediaRouter.get("/pdf", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=myFile.pdf");
    const source = getPdfReadStream(movies);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});
export default mediaRouter;
