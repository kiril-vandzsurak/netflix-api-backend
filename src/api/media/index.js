import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getPdfReadStream } from "../../lib/pdf-tools.js";
import fs from "fs-extra";
import { pipeline } from "stream";

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
  const newMovie = { ...req.body, createdAt: new Date(), id: uniqid() };
  const movieArr = JSON.parse(fs.readFileSync(movieJSONPath));
  movieArr.push(newMovie);
  fs.writeFileSync(movieJSONPath, JSON.stringify(movieArr));
  res.status(201).send({ id: newMovie.id });
});

mediaRouter.post("/:id/poster", (req, res) => {
  const allMovies = JSON.parse(fs.readFileSync(movieJSONPath));
  const index = allMovies.findIndex(
    (singleMovie) => singleMovie.id === req.params.id
  );
  const oldMovies = allMovies[index];
  const updatedMovies = { ...oldMovies, ...req.body, updatedAt: new Date() };
  allMovies[index] = updatedMovies;
  fs.writeFileSync(movieJSONPath, JSON.stringify(allMovies));
  res.send(updatedMovies);
});

mediaRouter.get("/:id/pdf", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=myFile.pdf");
    const allMovies = JSON.parse(fs.readFileSync(movieJSONPath));
    const index = allMovies.findIndex(
      (singleMovie) => singleMovie.id === req.params.id
    );
    const source = getPdfReadStream(allMovies[index]);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});
export default mediaRouter;
