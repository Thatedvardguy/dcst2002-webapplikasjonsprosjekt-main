import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import recipeService, { Meal } from '../src/recipe-service';
import {
  allCategories,
  testRecipes,
  currentRecipes,
  allAreaASC,
  allIngredientsASC,
  allMeasuremnts,
  createUsers,
  getUsers,
  getAllUsers,
  wrongpass,
} from './test-variables';

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query(
    'SET FOREIGN_KEY_CHECKS = 0; TRUNCATE Meals; TRUNCATE Meal_ingredient_measure; DELETE FROM Ingredients WHERE name = "Test Ingediens"; TRUNCATE Users; TRUNCATE Likes; SET FOREIGN_KEY_CHECKS = 1;',
    (error) => {
      if (error) return done(error);

      // Create testTasks sequentially in order to set correct id, and call done() when finished
      recipeService
        .create(
          testRecipes[0].name,
          testRecipes[0].drink,
          testRecipes[0].category,
          testRecipes[0].area,
          testRecipes[0].instructions,
          testRecipes[0].thumb,
          testRecipes[0].youtube,
          testRecipes[0].ingredients
        )
        .then(() =>
          recipeService.create(
            testRecipes[1].name,
            testRecipes[1].drink,
            testRecipes[1].category,
            testRecipes[1].area,
            testRecipes[1].instructions,
            testRecipes[1].thumb,
            testRecipes[1].youtube,
            testRecipes[1].ingredients
          )
        ) // Create testTask[1] after testTask[0] has been created
        .then(() => axios.post('/users/', createUsers[0]))
        .then(() => recipeService.createUser(createUsers[1]))
        .then(() => done()); // Call done() after createUsers[1] has been created
    }
  );
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch recipes (GET)', () => {
  test('Fetch all recipes (200 OK)', (done) => {
    axios.get('/recipes').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(currentRecipes);
      done();
    });
  });
  test('Fetch all recipes (500 Internal Server Error)', async () => {
    recipeService.getAll = jest.fn(() => Promise.reject());
    try {
      const response = await axios.get('/recipes');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
  // /* 404 ikke i router */
  // test('Fetch all recipes (404 Not Found)', (done) => {
  //   axios
  //     .get('/recipe')
  //     .then((_response) => done(new Error()))
  //     .catch((error) => {
  //       // expect(_response.status).toEqual(404);
  //       expect(error.message).toEqual('Request failed with status code 404');
  //       done();
  //     });
  // });
  test('Fetch recipe (200 OK)', (done) => {
    axios.get('/recipes/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(currentRecipes[0]);
      done();
    });
  });
  test('Fetch recipe (500 Internal Server Error)', async () => {
    recipeService.get = jest.fn(() => Promise.reject());
    try {
      const response = await axios.get('/recipes/1');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
  test('Fetch recipe (404 Not Found)', (done) => {
    axios
      .get('/recipe/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new recipe (POST)', () => {
  test('Create new recipe (200 OK)', (done) => {
    axios
      .post('/recipes', {
        name: testRecipes[2].name,
        drink: testRecipes[2].drink,
        category: testRecipes[2].category,
        area: testRecipes[2].area,
        instructions: testRecipes[2].instructions,
        thumb: testRecipes[2].thumb,
        youtube: testRecipes[2].youtube,
        ingredients: testRecipes[2].ingredients,
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ id: 3 });
        done();
      });
  });

  test('Create new recipe (500 Internal Server Error)', async () => {
    try {
      const response = await expect(() => axios.get('/recipes')).rejects;
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
  test('Create new recipe (400 Missing Something)', async () => {
    let failedrecipe = {
      area: testRecipes[2].area,
      instructions: testRecipes[2].instructions,
      thumb: testRecipes[2].thumb,
      youtube: testRecipes[2].youtube,
      ingredients: testRecipes[2].ingredients,
    };
    try {
      const response = await axios.post('/recipes', failedrecipe);
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
    }
  });
});

describe('Update recipe (PUT)', () => {
  test('Remove recipe ingredient (200 OK)', (done) => {
    axios
      .put('/recipes/1', {
        id: 1,
        name: 'BEKFAST',
        drink: 'Water',
        category: 2,
        area: 2,
        instructions: 'Whisk em good',
        thumb: null,
        youtube: null,
        ingredients: [{ name: 'Bread', number: 2, abbreviation: 21 }],
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });
  test('Add new existing ingredient (200 OK)', (done) => {
    axios
      .put('/recipes/1', {
        id: 1,
        name: 'BEKFAST',
        drink: 'Water',
        category: 2,
        area: 2,
        instructions: 'Whisk em good',
        thumb: null,
        youtube: null,
        ingredients: [
          { name: 'Ackee', number: 2, abbreviation: 21 },
          { name: 'Bread', number: 2, abbreviation: 21 },
          { name: 'Egg', number: 2, abbreviation: 21 },
        ],
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });
  test('Add new non-existing ingredient (200 OK)', (done) => {
    axios
      .put('/recipes/1', {
        id: 1,
        name: 'BEKFAST',
        drink: 'Water',
        category: 2,
        area: 2,
        instructions: 'Whisk em good',
        thumb: null,
        youtube: null,
        ingredients: [
          { name: 'Test Ingediens', number: 2, abbreviation: 21 },
          { name: 'Bread', number: 2, abbreviation: 21 },
          { name: 'Egg', number: 2, abbreviation: 21 },
        ],
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });
});

/* FEIL */
describe('Fetch ingredients (GET)', () => {
  test('Fetch all ingredients (200 OK)', (done) => {
    axios.get('/ingredients/').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(allIngredientsASC);
      done();
    });
  });
});

describe('Delete recipe (DELETE)', () => {
  test('Delete recipe (200 OK)', (done) => {
    axios.delete('/recipes/1').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
  test('Delete recipe (500 Internal Server Error)', async () => {
    recipeService.delete = jest.fn(() => Promise.reject(new Error('No row deleted')));
    try {
      const response = await axios.delete('/recipes/2');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
  // 404 ikke i router
  // test('Delete recipe (404 Not found)', (done) => {
  //   axios.delete('/recipes/5').then((response) => {
  //     expect(response.status).toEqual(404);
  //     done();
  //   });
  // });
});

describe('Fetch category (GET)', () => {
  test('Fetch all categories (200 OK)', (done) => {
    axios.get('/categories/').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(allCategories);
      done();
    });
  });

  test('Fetch all categories (500 Internal Server Error)', async () => {
    recipeService.getAllCategories = jest.fn(() => Promise.reject());
    try {
      const response = await axios.get('/categories/');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Fetch area (GET)', () => {
  test('Fetch all areas (200 OK)', (done) => {
    axios.get('/areas/').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(allAreaASC);
      done();
    });
  });

  test('Fetch all areas (500 Internal Server Error)', async () => {
    recipeService.getAllAreas = jest.fn(() => Promise.reject());
    try {
      const response = await axios.get('/areas/');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Fetch measurements (GET)', () => {
  test('Fetch all measurements (200 OK)', (done) => {
    axios.get('/measurements/').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(allMeasuremnts);
      done();
    });
  });

  test('Fetch all measurements (500 Internal Server Error)', async () => {
    recipeService.getAllMeasurements = jest.fn(() => Promise.reject());
    try {
      const response = await axios.get('/measurements/');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Login / Users (GET)', () => {
  test('Log user in (200 OK)', (done) => {
    axios.post('/login/', getUsers[0]).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('Log user in (500 Internal Server Error)', async () => {
    //Will return error 500 due to lack of complete axios.post syntax
    await axios.post('/login/').catch((error) => {
      expect(error.response.status).toEqual(500);
    });
  });

  test('Log user in (404 Password mismatch)', (done) => {
    axios.post('/login/', wrongpass[0]).catch((response) => {
      expect(response.code).toEqual('ERR_BAD_REQUEST');
      expect(response.message).toEqual('Request failed with status code 404');
      done();
    });
  });

  test('create user (200 OK)', (done) => {
    axios.post('/users/', createUsers[2]).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ userId: 3 });
      done();
    });
  });
});

describe('Give Likes (POST)', () => {
  test('give like (200 OK)', (done) => {
    axios
      .post('/likes/', { user_id: getUsers[0].id, meal_id: currentRecipes[0].id })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });
});

// describe('Fetch likes (GET)', () => {
//   //   /* FEIL */
//   test('Fetch all likes (200 OK)', (done) => {
//     axios.get('/likes/').then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual([{ id: 1, likes: 1, name: 'African Breakfast' }]);
//       done();
//     });
//   });
//   //   /* FEIL */
//   test('Fetch likes for User (200 OK)', (done) => {
//     axios.get('/likes/user=1').then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual([1]);
//       done();
//     });
//   });
// });

describe('Delete likes (DELETE)', () => {
  test('delete like for one recipe (200 OK)', (done) => {
    axios
      //@ts-ignore
      .delete('/likes/', { user_id: getUsers[0].id, meal_id: currentRecipes[0].id })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });
});

describe('Testing hashing of password', () => {
  test('testing hash of password "Password123"', (done) => {
    let password: string = 'Password123';
    let someOtherPassword: string = 'someOtherPassword';

    bcrypt.hash(password, saltRounds, function (err: any, hash: string) {
      expect(hash).toContain('$2b$10$');

      bcrypt.compare(password, hash, function (err: any, result: boolean) {
        expect(result).toBe(true);
      });

      bcrypt.compare(someOtherPassword, hash, function (err: any, result: boolean) {
        expect(result).toBe(false);
      });
      done();
    });
  });

  test('Comparing duplicate hashes of same password', (done) => {
    let password: string = 'Password123';

    bcrypt.hash(password, saltRounds, function (err: any, hash1: string) {
      bcrypt.hash(password, saltRounds, function (err: any, hash2: string) {
        bcrypt.compare(hash1, hash2, function (err: any, result: boolean) {
          expect(result).toBe(false);
        });
      });
      done();
    });
  });
});
