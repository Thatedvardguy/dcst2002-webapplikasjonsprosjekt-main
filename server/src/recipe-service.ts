import pool from './mysql-pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Meal = {
  id: number;
  name: string;
  drink: string | null;
  category: string;
  area: string;
  instructions: string;
  thumb: string | null;
  youtube: string | null;
  likes: number | null;
  ingredients: { name: string; number: number | null; abbreviation: string }[];
};

class RecipeService {
  /**
   * Henter en enkelt oppskrift.
   * @param id
   * @returns
   */
  async get(id: number) {
    let meal_object = await new Promise<Meal>((resolve, reject) => {
      pool.query(
        'SELECT m.id, m.name, m.drink, c.name AS category, a.name AS area, \
        m.instructions, m.thumb, m.youtube, COUNT(l.meal_id) + m.likes AS likes \
        FROM Meals m JOIN Category c ON m.category = c.id \
        JOIN Area a ON m.area = a.id \
        LEFT JOIN Likes l ON m.id = l.meal_id \
        WHERE m.id = ?',
        [id],
        (error: any, results1: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results1[0] as Meal);
        }
      );
    });
    let meal_ingredients = await new Promise<Meal['ingredients']>((resolve, reject) => {
      pool.query(
        'SELECT i.name, mim.number, x.abbreviation \
        FROM Meal_ingredient_measure mim \
        INNER JOIN Meals m ON mim.meal_id = m.id \
        INNER JOIN Ingredients i ON mim.ingredient = i.id \
        INNER JOIN Measurements x ON mim.measurement = x.id \
        WHERE m.id = ?',
        [id],
        (error: any, results2: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results2 as Meal['ingredients']);
        }
      );
    });
    //@ts-ignore
    meal_object.ingredients = meal_ingredients;
    return meal_object;
  }

  /**
   * Henter alle oppskrifter.
   */
  async getAll() {
    let temp_objects = await new Promise<Meal[]>((resolve, reject) => {
      pool.query(
        'SELECT m.id, m.name, m.drink, c.name AS category, a.name AS area, \
        m.instructions, m.thumb, m.youtube, COUNT(l.meal_id) + m.likes AS likes \
        FROM Meals m JOIN Category c ON m.category = c.id \
        JOIN Area a ON m.area = a.id \
        LEFT JOIN Likes l ON m.id = l.meal_id \
        GROUP BY m.id',
        (error: any, results1: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results1 as Meal[]);
        }
      );
    });
    await Promise.all(
      temp_objects.map(async (o) => {
        o.ingredients = await new Promise<Meal['ingredients']>((resolve, reject) => {
          pool.query(
            'SELECT i.name, mim.number, x.abbreviation \
            FROM Meal_ingredient_measure mim \
            INNER JOIN Meals m ON mim.meal_id = m.id \
            INNER JOIN Ingredients i ON mim.ingredient = i.id \
            INNER JOIN Measurements x ON mim.measurement = x.id \
            WHERE m.id = ?',
            [o.id],
            (error: any, results2: RowDataPacket[]) => {
              if (error) return reject(error);
              resolve(results2 as Meal['ingredients']);
            }
          );
        });
      })
    );

    return temp_objects;
  }

  //NEW VERSION
  /**
   *   Lager en oppskrift.
   *   1. Sette informasjon inn i Meals
   *   - løkke for ingredienser -
   *     2a). Hente ut ingrediens ID
   *     2b). Sette inn eventuelle nye ingredienser som ikke er i database og hente ID
   *     3. opprette meal_ingredient_measure med hentet Meal og ingrediens ID
   * @param name
   * @param drink
   * @param category
   * @param area
   * @param instructions
   * @param thumb
   * @param youtube
   * @param ingredients
   * @returns
   */
  async create(
    name: string,
    drink: string | null,
    category: number,
    area: number,
    instructions: string,
    thumb: string | null,
    youtube: string | null,
    ingredients: { name: string; number: number | null; abbreviation: number }[]
  ) {
    function getMeal() {
      return new Promise<number>((resolve, reject) => {
        pool.query(
          'INSERT INTO Meals(name, drink, category, area, instructions, thumb, youtube, likes) \
          VALUES(?,?,?,?,?,?,?,?)',
          [name, drink, category, area, instructions, thumb, youtube, 0],
          (error: any, results1: ResultSetHeader) => {
            if (error) return reject(error);

            //Ny pool query for ingredienser - løkke
            resolve(results1.insertId);
          }
        );
      });
    }

    function getId(i: { name: string; number: number | null; abbreviation: number }) {
      return new Promise<number>((resolve, reject) => {
        pool.query(
          'SELECT id FROM Ingredients WHERE name = ?',
          [i.name],
          (error: any, results2: RowDataPacket[]) => {
            if (error) return reject(error);

            if (results2.length != 0) {
              //ingrediens eksisterer
              resolve(results2[0].id);
            } else {
              //ingrediens eksisterer ikke
              pool.query(
                'INSERT INTO Ingredients(name) VALUES (?)',
                [i.name],
                (error: any, results3: ResultSetHeader) => {
                  if (error) return reject(error);
                  resolve(results3.insertId);
                }
              );
            }
          }
        );
      });
    }

    function insertMeal(
      result1: number,
      result2: number,
      i: { name: string; number: number | null; abbreviation: number }
    ) {
      return new Promise<number>((resolve, reject) => {
        pool.query(
          'INSERT INTO Meal_ingredient_measure(meal_id, ingredient, number, measurement) \
          VALUES(?,?,?,?)',
          [result1, result2, i.number, i.abbreviation],
          (error: any, results4: ResultSetHeader) => {
            if (error) return reject(error);
            resolve(results4.insertId);
          }
        );
      });
    }

    let res1 = await getMeal();
    await Promise.all(
      ingredients.map(async (i) => {
        await getId(i).then((result2) => {
          insertMeal(res1, result2, i);
        });
      })
    );

    return res1;
  }

  /**
   *   Oppdaterer en oppskrift.
   *   1. oppdatere Meal.
   *   2. oppdatere meal_ingredient_measure - sletting og/eller innlegging av nye.
   * @param id
   * @param name
   * @param drink
   * @param category
   * @param area
   * @param instructions
   * @param thumb
   * @param youtube
   * @param ingredients
   */
  async updateMeals(
    id: number,
    name: string,
    drink: string | null,
    category: number,
    area: number,
    instructions: string,
    thumb: string | null,
    youtube: string | null,
    ingredients: { name: string; number: number; abbreviation: number }[]
  ) {
    //Oppdatere generell info om oppskriften
    function updateMeals() {
      return new Promise<void>((resolve, reject) => {
        pool.query(
          'UPDATE Meals \
          SET name = ?, drink = ?, category = ?, area = ?, instructions = ?, thumb = ?, youtube = ? \
          WHERE id = ?',
          [name, drink, category, area, instructions, thumb, youtube, id],
          (error: any, results1: ResultSetHeader) => {
            if (error) return reject(error);
            resolve();
          }
        );
      });
    }
    //Hente ut de nåværende/"gamle" meal_ingredient_measure radene. Hentes ut likt som ingredients.
    function get_current_Mim() {
      return new Promise<{ name: string; number: number; abbreviation: number }[]>(
        (resolve, reject) => {
          pool.query(
            'SELECT i.name, mim.number, mim.measurement as abbreviation \
            FROM Meal_ingredient_measure mim \
            INNER JOIN Ingredients i ON mim.ingredient = i.id \
            WHERE mim.meal_id = ?',
            [id],
            (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
              resolve(results as { name: string; number: number; abbreviation: number }[]);
            }
          );
        }
      );
    }

    //slette gamle meal_ingredient_measure
    function delete_mim(ingr: any) {
      return new Promise<void>((resolve, reject) => {
        pool.query(
          'DELETE FROM Meal_ingredient_measure \
          WHERE meal_id = ? \
          AND ingredient = (SELECT id FROM Ingredients WHERE name = ?)',
          [id, ingr.name],
          (error: any, results: ResultSetHeader) => {
            if (error) return reject(error);
            resolve();
          }
        );
      });
    }

    function get_ingredient_id(i: { name: string; number: number; abbreviation: number }) {
      return new Promise<number>((resolve, reject) => {
        pool.query(
          'SELECT id FROM Ingredients WHERE name = ?',
          [i.name],
          (error: any, results2: RowDataPacket[]) => {
            if (error) return reject(error);

            if (results2.length != 0) {
              resolve(results2[0].id);
            } else {
              //ingrediens eksisterer ikke
              pool.query(
                'INSERT INTO Ingredients(name) VALUES (?)',
                [i.name],
                (error: any, results3: ResultSetHeader) => {
                  if (error) return reject(error);
                  resolve(results3.insertId);
                }
              );
            }
          }
        );
      });
    }

    //sette inn ny meal_ingredient_measure for de nye/oppdaterte ingrediensene
    function insert_new_mim(ingr_id: number, ingr_number: number, measure_id: number) {
      return new Promise<void>((resolve, reject) => {
        pool.query(
          'INSERT INTO Meal_ingredient_measure(meal_id, ingredient, number, measurement) \
          VALUES (?,?,?,?)',
          [id, ingr_id, ingr_number, measure_id],
          (error: any, results: ResultSetHeader) => {
            if (error) return reject(error);
            resolve();
          }
        );
      });
    }

    await updateMeals().then(async () => {
      //henter ut nåværende mim
      await get_current_Mim().then(async (results) => {
        //Ser om ingredients inkluderer de gamle mim, gjør det ikke slettes de gamle mim.
        await Promise.all(
          results.map(async (i) => {
            if (
              !(
                ingredients.filter(
                  (ingr) =>
                    i.name === ingr.name &&
                    i.number === ingr.number &&
                    i.abbreviation === ingr.abbreviation
                ).length > 0
              )
            ) {
              await delete_mim(i);
            }
          })
        ).then(async () => {
          //ser om de nye ingrediensene er i mim, gjør de ikke, legges de til
          await Promise.all(
            ingredients.map(async (i) => {
              if (
                !(
                  results.filter(
                    (ingr) =>
                      i.name === ingr.name &&
                      i.number === ingr.number &&
                      i.abbreviation === ingr.abbreviation
                  ).length > 0
                )
              ) {
                await get_ingredient_id(i).then(async (ingr_id) => {
                  await insert_new_mim(ingr_id, i.number, i.abbreviation);
                });
              }
            })
          );
        });
      });
    });
  }

  /**
   * Sletter oppskrift.
   * Slette rad i Meals - rader i meal_ingredient_measure slettes ved bruk av constraint i databaseløsning.
   * @param id
   * @returns
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Meals WHERE id = ?', [id], (error: any, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) return reject(new Error('No row deleted'));

        resolve();
      });
    });
  }

  /**
   * Henter alle brukere.
   * @returns
   */
  getAllUsers() {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.query(
        'SELECT u.username, u.password FROM Users u',
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  /**
   * Henter en brukers info.
   * @param name
   * @returns
   */
  getUser(name: string) {
    return new Promise<any>((resolve, reject) => {
      pool.query(
        'SELECT u.id, u.username, u.password FROM Users u WHERE u.username = ?',
        [name],
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results[0]);
        }
      );
    });
  }

  /**
   * Oppretter bruker.
   * @param data
   * @returns
   */
  createUser(data: { username: string; password: string; admin: boolean | number | null }) {
    return new Promise<{ userId: number }>((resolve, reject) => {
      pool.query(
        'INSERT INTO Users SET username=?, password=?, admin=?',
        [data.username, data.password, data.admin],
        (error: any, results: ResultSetHeader) => {
          if (error) return reject(error);
          resolve({ userId: results.insertId });
        }
      );
    });
  }

  /**
   * Henter antall likes på alle oppskrifter, sortert i minkende rekkefølge.
   */
  getLikes() {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.query(
        'SELECT m.id, COUNT(l.meal_id) + m.likes AS likes, m.name \
        FROM Likes l \
        INNER JOIN Meals m ON l.meal_id = m.id \
        GROUP BY m.id \
        ORDER BY likes DESC',
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  /**
   * Henter informasjon om innlogget bruker har liket spesifik oppskrift.
   * @param user_id
   * @returns
   */
  getUserLikes(user_id: number) {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.query(
        'SELECT l.meal_id \
        FROM Likes l \
        WHERE l.user_id = ?',
        [user_id],
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  /**
   * Legger til Likes.
   * @param user_id
   * @param meal_id
   * @returns
   */
  giveLike(user_id: number, meal_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT IGNORE INTO Likes (user_id, meal_id) \
        VALUES (?,?)',
        [user_id, meal_id],
        (error: any, results: ResultSetHeader) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  }

  /**
   * Fjærner likes.
   * @param user_id
   * @param meal_id
   * @returns
   */
  removeLike(user_id: number, meal_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM Likes \
      WHERE user_id=? \
      AND meal_id=?',
        [user_id, meal_id],
        (error: any, results: ResultSetHeader) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  }

  /**
   * Hente ut alle kategorier
   */
  getAllCategories() {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.query(
        'SELECT c.id, c.name AS category FROM Category c ORDER BY c.id ASC',
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  /**
   * Henter ut alle områder.
   */
  getAllAreas() {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.query(
        'SELECT a.id, a.name AS area FROM Area a ORDER BY a.id ASC',
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  /**
   * Henter ut alle ingredienser.
   */
  getAllIngredients() {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.query(
        'SELECT i.id, i.name AS ingredient FROM Ingredients i ORDER BY i.name ASC',
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  /**
   * Hente ut alle måleenheter.
   */
  getAllMeasurements() {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.query(
        'SELECT mea.id, mea.abbreviation, mea.singular, mea.plural AS measurement \
        FROM Measurements mea',
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }
}

const recipeService = new RecipeService();
export default recipeService;
