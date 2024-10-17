import { Meal } from './recipe-service';

let loggedIn = false;
let siteUsername: string = '';
let siteUserId: number = 0;
let allMeals: Array<Meal> = [];
let userLikedMeals: Array<number> = [];
let localShoppingCart: { name: string; number: number | null; abbreviation: string }[] = [];

let Set_login_status = (value: boolean) => {
  loggedIn = value;
};
let Set_siteUsername = (value: string) => {
  siteUsername = value;
};
let Set_siteUserId = (value: number) => {
  siteUserId = value;
};
let Set_userLikedMeals = (value: Array<number>) => {
  userLikedMeals = value;
};
let Set_localShoppingCart = (
  value: { name: string; number: number | null; abbreviation: string }[]
) => {
  localShoppingCart = value;
};
let Push_to_localShoppingCart = (value: {
  name: string;
  number: number | null;
  abbreviation: string;
}) => {
  localShoppingCart.push(value);
};
let Push_to_allMeals = (value: Meal) => {
  allMeals.push(value);
};

export {
  loggedIn,
  siteUsername,
  siteUserId,
  allMeals,
  userLikedMeals,
  localShoppingCart,
  Set_login_status,
  Set_siteUsername,
  Set_siteUserId,
  Set_userLikedMeals,
  Set_localShoppingCart,
  Push_to_localShoppingCart,
  Push_to_allMeals,
};
