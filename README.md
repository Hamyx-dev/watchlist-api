# CRUD Operations with Express and MongoDB

This is what I did after completing the lessons on building a REST API with Express and MongoDB.

## What I Built

I built a backend REST API for a movie watchlist application. The API connects to a MongoDB database using Mongoose and allows you to create, read, update and delete movies. I used Node.js and Express for the server, Mongoose for the database connection and Zod, dotenv and other packages for the project.

## The Movie Schema

The first thing I did was create a Movie model with the following fields:

- title — String, required. If missing, the database rejects it.
- genre — String, required.
- isWatched — Boolean, default is false.
- rating — Number, min is 1, max is 5, default is null.

I created a separate movie.model.js file inside a model folder and exported the model from there. I learnt that each field in a Mongoose schema can be an object with type, required, default, min and max instead of just the plain type.

## The Routes (CRUD)

### CREATE — POST /movies

I wrote a POST route that takes movie data from req.body, creates a new instance of the movie model using new movieModel(req.body) and saves it to the database using .save(). I wrapped everything in a try/catch block so that if the title is missing, Mongoose throws a validation error and the catch block sends back a 400 Bad Request with an error message. I learnt that you cannot call .save() directly on req.body because it is just plain data. You have to first wrap it in new movieModel() to turn it into a Mongoose document that has the .save() method.

### READ — GET /movies

I wrote a GET route that returns all movies from the database. The twist here was the genre filter. If the request has ?genre=Comedy in the URL, it means req.query.genre exists and I pass { genre: req.query.genre } into .find(). If not, I just call .find() with nothing and it returns all movies. I used an if/else block inside the try to handle both cases. I learnt that req.query is how you read what comes after the ? in a URL.

### READ — GET /movies/:id

I wrote a GET route that finds one specific movie by its ID using movieModel.findById(req.params.id). I learnt that if the ID does not exist in the database, Mongoose returns null and not an error. So I had to check if (!movie) and send back a 404 Not Found status with a message saying the movie was not found.

### UPDATE — PUT /movies/:id

I wrote a PUT route that updates a movie by its ID using movieModel.findByIdAndUpdate(). I passed { new: true } so it returns the updated movie instead of the old one, and { runValidators: true } so the update respects the schema rules like min and max on the rating.

The business logic here was that if someone tries to update isWatched to true, they must also provide a rating. I added an if check before calling findByIdAndUpdate — if req.body.isWatched === true and !req.body.rating, I reject the request with a 400 and a message saying a rating is required when marking a movie as watched. I learnt that this kind of logic check has to come before the database call, not inside it.

### DELETE — DELETE /movies/:id

I wrote a DELETE route that deletes a movie by its ID using movieModel.findByIdAndDelete(). If the movie is not found it sends back a 404. If it is deleted successfully it sends back { message: "Movie successfully removed" }. For the bonus challenge I also returned the deleted movie object alongside the message. I learnt that findByIdAndDelete() already returns the deleted document so I just stored it in a variable and sent it back in the response.

## What I Learnt

1. Every time you talk to the database you have to use async on the route function and await on the Mongoose method because the database takes time to respond and you have to wait for it.

2. All database calls should be wrapped in a try/catch block because database operations can fail. If something breaks the catch block sends a 500 Internal Server Error status.

3. req.body is just raw data coming from the request. To save it to the database you have to turn it into a Mongoose document first using new movieModel(req.body) before you can call .save() on it.

4. The difference between 404 and 500 is that 404 means the resource was not found and 500 means something went wrong on the server side. I used 404 when a movie ID did not exist and 500 when the database itself had a problem.

5. req.params is how you get the ID from the URL like /movies/:id and req.query is how you get the filter from the URL like /movies?genre=Comedy. They are two different things and I mixed them up at first.

6. Business logic checks should always come before the database call. If you check after, you have already made an unnecessary database call.

7. The .env file must be in the root of the project folder and not inside the src folder. Node looks for it relative to where you run the command from, not where your file is.