import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import movieModel from "./model/movie.model.js";

export const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
//question 2
app.get("/movies", async (req, res) => {
  try {
    // this will find only one
    if (req.query.genre) {
      const movies = await movieModel.find({ genre: req.query.genre });
      res.json(movies);
      // this will find all the movies
    } else {
      const movies = await movieModel.find();
      res.json(movies);
    }
    
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//question 3
app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await movieModel.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/movies", async (req, res) => {
  try {
    const newMovieModel = new movieModel(req.body);
    await newMovieModel.save();

    res.json({
      message: "New movie added",
      data: newMovieModel,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//question 4
app.put("/movies/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const newData = req.body;

    if (req.body.isWatched === true && !req.body.rating) {
  return res.status(400).json({ message: 'A rating is required when marking a movie as watched'
 });
}

    const updatedMovie = await movieModel.findByIdAndUpdate(movieId, newData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });

    res.json({ message: "Movie updated", data: updatedMovie });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});




