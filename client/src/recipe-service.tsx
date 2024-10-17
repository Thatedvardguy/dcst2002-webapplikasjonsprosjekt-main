import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Meal = {
  id: number;
  name: string;
  drink: string | null;
  category: string;
  area: string;
  instructions: string;
  thumb: string | null;
  youtube: string | null;
  likes: number;
  ingredients: [{ name: string; number: number | null; abbreviation: string }];
};

export type User = {
  id: number | null;
  name: string;
  password: string;
  admin: boolean | null;
};

class MealService {
  /**
   * Get meal with given id.
   */
  get(id: number) {
    return axios.get<Meal>('/recipes/' + id).then((response) => response.data);
  }

  /**
   * Get all meals.
   */
  getAll() {
    return axios.get<Meal[]>('/recipes/').then((response) => response.data);
  }

  /**
   * Deletes Recipe.
   */
  delete(id: number) {
    return axios.delete('/recipes/' + id).then((response) => response.data);
  }

  /**
   * Creates Recipe.
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
  create(
    name: string,
    drink: string | null,
    category: number,
    area: number,
    instructions: string,
    thumb: string | null,
    youtube: string | null,
    ingredients: { name: string; number: number | null; abbreviation: number }[]
  ) {
    return axios
      .post('/recipes/', {
        name: name,
        drink: drink,
        category: category,
        area: area,
        instructions: instructions,
        thumb: thumb,
        youtube: youtube,
        ingredients: ingredients,
      })
      .then((response) => response.data.id);
  }

  /**
   * Updates Recipe.
   * @param id
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
  edit(
    id: number,
    name: string,
    drink: string | null,
    category: number,
    area: number,
    instructions: string,
    thumb: string | null,
    youtube: string | null,
    ingredients: { name: string; number: number | null; abbreviation: number }[]
  ) {
    return axios
      .put('/recipes/' + id, {
        id: id,
        name: name,
        drink: drink,
        category: category,
        area: area,
        instructions: instructions,
        thumb: thumb,
        youtube: youtube,
        ingredients: ingredients,
      })
      .then((response) => response.data.id);
  }

  /**
   * Get all likes.
   */
  getLikes() {
    return axios.get<any>('/likes/').then((response) => response.data);
  }

  /**
   * Get information on if the user has liked the recipe.
   * @param id
   * @returns
   */
  getUserLikes(id: number) {
    return axios.get<any>('/likes/user=' + id).then((response: any) => response.data);
  }

  /**
   * Give like.
   * @param user_id
   * @param meal_id
   * @returns
   */
  giveLike(user_id: number, meal_id: number) {
    return axios.post<any>('/likes/', { user_id, meal_id }).then((response) => {
      console.log(`User ${user_id} liking recipe ${meal_id}`);
      return response.data;
    });
  }

  /**
   * Remove like.
   * @param user_id
   * @param meal_id
   * @returns
   */
  removeLike(user_id: number, meal_id: number) {
    return axios.delete<any>('/likes/', { data: { user_id, meal_id } }).then((response) => {
      console.log(`User ${user_id} un-liking recipe ${meal_id}`);
      return response.data;
    });
  }

  /**
   * Get all categories.
   */
  getAllCategories() {
    return axios.get<any>('/categories/').then((response) => response.data);
  }

  /**
   * Get all areas.
   */
  getAllAreas() {
    return axios.get<any>('/areas/').then((response) => response.data);
  }

  /**
   * Get all ingredients.
   */
  getAllIngredients() {
    return axios
      .get<{ id: number; ingredient: string }[]>('/ingredients/')
      .then((response) => response.data);
  }

  /**
   * Get all measurements.
   */
  getAllMeasurements() {
    return axios.get<any>('/measurements/').then((response) => response.data);
  }

  /**
   * Get all users.
   */
  getUsers() {
    return axios.get<any>('/users/').then((response) => response.data);
  }

  /**
   * User login.
   * @param username
   * @param password
   * @returns
   */
  login(username: string, password: string) {
    return axios
      .post<User>('/login/', { username: username, password: password })
      .then((response) => {
        return response;
      });
  }

  /**
   * Create user.
   * @param username
   * @param password
   * @param admin
   * @returns
   */
  createUser(username: string, password: string, admin: boolean) {
    return axios
      .post<User>('/users/', {
        username: username,
        password: password,
        admin: admin,
      })
      .then((response) => response);
  }
}

const mealService = new MealService();
export default mealService;
