import express from 'express';
import recipeService from './recipe-service';

const recipeRouter = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

recipeRouter.get('/recipes', (_request, response) => {
  recipeService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

recipeRouter.get('/recipes/:id', (request, response) => {
  const id: number = Number(request.params.id);
  recipeService
    .get(id)
    .then((recipe) =>
      recipe ? response.send(recipe) : response.status(404).send('Recipe not found')
    )
    .catch((error) => response.status(500).send(error));
});

recipeRouter.post('/recipes', (request, response) => {
  const data = request.body;
  if (
    data &&
    data.name &&
    data.name.length != 0 &&
    data.category &&
    data.category.length != 0 &&
    data.area &&
    data.area.length != 0 &&
    data.instructions &&
    data.instructions.length != 0 &&
    data.ingredients &&
    data.ingredients.length != 0
  )
    recipeService
      .create(
        data.name,
        data.drink,
        data.category,
        data.area,
        data.instructions,
        data.thumb,
        data.youtube,
        data.ingredients
      )
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing something');
});

recipeRouter.delete('/recipes/:id', (request, response) => {
  recipeService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

recipeRouter.get('/likes/', (_request, response) => {
  recipeService
    .getLikes()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

recipeRouter.get('/likes/user=:id', (request, response) => {
  const id: number = Number(request.params.id);
  recipeService
    .getUserLikes(id)
    .then((likes) =>
      likes
        ? response.send(likes.map((x) => x.meal_id))
        : response.status(404).send('Likes not found')
    )
    .catch((error) => response.status(500).send(error));
});

recipeRouter.post('/likes/', (request, response) => {
  const data = request.body;
  console.log(`User ${data.user_id} liking recipe ${data.meal_id}`);
  recipeService
    .giveLike(data.user_id, data.meal_id)
    .then(() => response.status(200).send('Success'));
});

recipeRouter.delete('/likes/', (request, response) => {
  const data = request.body;
  console.log(`User ${data.user_id} un-liking recipe ${data.meal_id}`);
  recipeService
    .removeLike(data.user_id, data.meal_id)
    .then(() => response.status(200).send('Success'));
});

recipeRouter.get('/categories/', (_request, response) => {
  recipeService
    .getAllCategories()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

recipeRouter.get('/areas/', (_request, response) => {
  recipeService
    .getAllAreas()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

recipeRouter.get('/ingredients/', (_request, response) => {
  recipeService
    .getAllIngredients()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
recipeRouter.get('/measurements/', (_request, response) => {
  recipeService
    .getAllMeasurements()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

recipeRouter.put('/recipes/:id', (request, response) => {
  const data = request.body;
  if (
    data &&
    data.name &&
    data.name.length != 0 &&
    data.category &&
    data.category.length != 0 &&
    data.area &&
    data.area.length != 0 &&
    data.instructions &&
    data.instructions.length != 0 &&
    data.ingredients &&
    data.ingredients.length != 0
  ) {
    recipeService
      .updateMeals(
        data.id,
        data.name,
        data.drink,
        data.category,
        data.area,
        data.instructions,
        data.thumb,
        data.youtube,
        data.ingredients
      )
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  } else response.status(400).send('Missing something');
});

recipeRouter.post('/login/', (request, response) => {
  const data = request.body;
  console.log(`Getting user info on username: ${data.username}`);
  recipeService
    .getUser(data.username)
    .then((databaseUser) => {
      bcrypt.compare(data.password, databaseUser.password, function (err: any, result: any) {
        console.log('RESULTS, ', result);
        if (result) {
          {
            response.status(200).send(databaseUser);
          }
        } else if (!result) {
          return response.status(404).send('Login failed. User not found or password missmatch.');
        }
      });
    })
    .catch((error) => {
      console.log(error);
      response.status(500).send('Login failed');
    });
});

recipeRouter.post('/users/', (request, response) => {
  const data = request.body;
  if (data.username === 'Teapot') response.status(418).send(`ERROR 418: "I'm a Teapot"`);
  else if (data.username.length == 0 || data.username == null || data.username == undefined)
    response.status(400).send('Missing username');
  else if (data.password.length == 0 || data.password == null || data.password == undefined)
    response.status(400).send('Missing password');
  else if (data)
    recipeService.getUser(data.username).then((results) => {
      if (results) return response.status(400).send('User by that name already exists');
      else {
        bcrypt.hash(data.password, saltRounds).then(function (hash: any) {
          data.password = hash;
          recipeService
            .createUser(data)
            .then((results) => {
              response.status(200).send(results);
            })
            .catch((error) => {
              console.log(error);
              response.status(500).send(error);
            });
        });
      }
    });
  else response.status(400).send('User input error');
});

export default recipeRouter;
