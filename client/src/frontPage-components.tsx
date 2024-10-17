import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Card,
  Row,
  Column,
  Form,
  Button,
  Scrollbar,
  NavBarx,
  DropDownMenu,
  CardFrontPage,
} from './widgets';
import TextInput from 'react-autocomplete-input';
import mealService, { Meal } from './recipe-service';
import { createHashHistory } from 'history';
import { loggedIn, siteUsername, Push_to_allMeals } from './global-variables';
const history = createHashHistory();

export function Menu() {
  const [userName, setName] = React.useState('/login');
  const [isLoggedIn, setLoginStatus] = React.useState(false);

  const setUsernameLogIn = () => {
    setName(siteUsername);
    setLoginStatus(loggedIn);
  };

  React.useEffect(() => {
    window.addEventListener('click', setUsernameLogIn);
  }, [userName, isLoggedIn]);

  return (
    <NavBarx
      brand={
        <h2>
          <b>&nbsp;MatMania</b>
        </h2>
      }
    >
      <NavBarx.Link to="/newrecipe">Add Recipe</NavBarx.Link>
      <NavBarx.Link to={isLoggedIn ? '/' + userName : '/login'}>
        {isLoggedIn ? userName : 'Log in'}
      </NavBarx.Link>
      <NavBarx.Link to={isLoggedIn ? '/' + userName + '/shoppingcart' : '/login'}>
        {'Shopping Cart'}
      </NavBarx.Link>
    </NavBarx>
  );
}

export class FrontPageShowRecipe extends Component<{ meal: Meal }> {
  render(): React.ReactNode {
    return (
      <CardFrontPage title={<i>{this.props.meal.name}</i>}>
        <hr />
        <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around' }}>
          <Column width={7}>
            {this.props.meal.thumb ? (
              <Row>
                <span>
                  <img
                    className="img-thumbnail"
                    max-height={'100px'}
                    max-width={'160px'}
                    src={this.props.meal.thumb}
                    alt={this.props.meal.name}
                  />
                </span>
              </Row>
            ) : (
              ''
            )}
          </Column>
          <Column width={4}>
            <Row>
              <b>Region:</b>
              <ul>{this.props.meal.area}</ul>
            </Row>
            <Row>
              <b>Category:</b>
              <ul>{this.props.meal.category}</ul>
            </Row>
            <Row>
              <b>Likes:</b>
              <ul>
                {this.props.meal.likes}
                &nbsp;
                <img src="like.jpg" />
              </ul>
            </Row>
            <Row>
              <Column>
                <Button.Dark
                  onClick={() => {
                    history.push('/recipes/' + this.props.meal.id);
                  }}
                >
                  Go to Recipe
                </Button.Dark>
              </Column>
            </Row>
          </Column>
        </div>
      </CardFrontPage>
    );
  }
}

export class FrontPage extends Component {
  //All meals
  allMeals: Meal[] = [];

  //Meal that show on front-page
  DisplayMeals: Meal[] = [];
  //GetAll ingredients
  ingredients: string[] = [];
  ingredentsWithID: { id: number; ingredient: string }[] = [];
  areas: { id: number; area: string }[] = [];
  categories: { id: number; category: string }[] = [];
  likes: { id: number; likes: number; name: string }[] = [];
  //Input field
  search: string = '';
  //Filters
  areaFilter: number[] = [];
  areaFilterString: string[] = [];
  categoryFilter: number[] = [];
  categoryFilterString: string[] = [];
  ingredientsFilter: string[] = [];
  //Search results
  searchResults: Meal[] = [];

  render(): React.ReactNode {
    return (
      <Card title="MatMania">
        {loggedIn ? (
          <Row>
            <h5>
              <i>Currently logged in as: {siteUsername}</i>
            </h5>
          </Row>
        ) : (
          ''
        )}
        <hr />
        <Row>
          <Column width={3}>
            <h2>
              <i>Filters</i>
            </h2>
            <DropDownMenu title="Area" width={window.innerWidth / 4.5}>
              {this.areas.map((area) => (
                <Row key={area.id}>
                  <Column>
                    <DropDownMenu.Element value="Area" id={area.id}>
                      {area.area + ' '}
                      <Form.Checkbox
                        checked={this.checkIfInFilter(this.areaFilter, area.id)}
                        onChange={() => {
                          if (this.checkIfInFilter(this.areaFilter, area.id)) {
                            this.removeFromFilter(this.areaFilter, this.areaFilterString, area.id);
                          } else {
                            this.areaFilter.push(area.id);
                            this.areaFilterString.push(area.area);
                          }
                          this.FilterOut(this.allMeals);
                        }}
                      />
                    </DropDownMenu.Element>
                  </Column>
                </Row>
              ))}
            </DropDownMenu>
            <DropDownMenu title="Category" width={window.innerWidth / 4.5}>
              {this.categories.map((cat) => (
                <Row key={cat.id}>
                  <Column>
                    <DropDownMenu.Element value="Category" id={cat.id}>
                      {cat.category + ' '}
                      <Form.Checkbox
                        checked={this.checkIfInFilter(this.categoryFilter, cat.id)}
                        onChange={() => {
                          if (this.checkIfInFilter(this.categoryFilter, cat.id)) {
                            this.removeFromFilter(
                              this.categoryFilter,
                              this.categoryFilterString,
                              cat.id
                            );
                          } else {
                            this.categoryFilter.push(cat.id);
                            this.categoryFilterString.push(cat.category);
                          }
                          this.FilterOut(this.allMeals);
                        }}
                      />
                    </DropDownMenu.Element>
                  </Column>
                </Row>
              ))}
            </DropDownMenu>
            <DropDownMenu title={'Ingredients'} width={window.innerWidth / 4.5}>
              <TextInput
                placeholder="Enter ingredients here"
                trigger={['', ',']}
                spacer={','}
                changeOnSelect={(trigger: string, slug: string) => trigger + slug}
                onSelect={(selection: string) => {
                  this.AddToIngredientFilter(selection);
                  this.findRecommendations();
                }}
                options={this.ingredients}
              ></TextInput>
            </DropDownMenu>
          </Column>
          <Column>
            <Row>
              <h2>
                <i>Search</i>
              </h2>
              <div style={{ display: 'flex' }}>
                <Row>
                  <Form.Input
                    type="text"
                    value={this.search}
                    onChange={(event) => {
                      this.search = event.currentTarget.value;
                    }}
                  ></Form.Input>
                </Row>
                <Button.Success
                  onClick={() => {
                    this.ShowSearch(this.search);
                  }}
                >
                  Search
                </Button.Success>
              </div>
              <Column>
                <Button.Dark
                  onClick={() => {
                    this.SortByNew();
                  }}
                >
                  New
                </Button.Dark>
                <Button.Dark
                  onClick={() => {
                    this.SortByPopular();
                  }}
                >
                  Popular
                </Button.Dark>
              </Column>
            </Row>
            <Row>
              <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
                {this.DisplayMeals.length != 0 ? (
                  this.DisplayMeals.map((meal) => (
                    <Row key={meal.id}>
                      <FrontPageShowRecipe meal={meal} />
                    </Row>
                  ))
                ) : (
                  <h2>
                    <i>No Recipes were found, try different filters / ingredients</i>
                  </h2>
                )}
              </Scrollbar>
            </Row>
          </Column>
        </Row>
      </Card>
    );
  }

  checkIfInFilter(array: number[], element: number) {
    if (array.find((e) => e == element) == undefined) {
      return false;
    } else {
      return true;
    }
  }
  removeFromFilter(array: number[], array2: string[], element: number) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == element) {
        array.splice(i, 1);
        array2.splice(i, 1);
      }
    }
  }

  AddToIngredientFilter(selection: string) {
    this.ingredientsFilter = selection.toString().split(',');
    this.ingredientsFilter.pop();
  }

  ShowSearch(search: string) {
    mealService.getAll().then((mealName) => {
      this.searchResults = [];
      mealName.forEach((element) => {
        if (element.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
          this.searchResults.push(element);
        }
      });
      if (search !== '') {
        this.DisplayMeals = this.searchResults;
      }
    });
  }

  SortByNew() {
    this.DisplayMeals = this.allMeals.sort((a, b) => {
      return b.id - a.id;
    });
  }

  SortByPopular() {
    this.DisplayMeals = this.allMeals
      .sort((a, b) => {
        return b.likes - a.likes;
      })
      .filter((item) => item.likes > 0);
  }

  FilterOut(array: Meal[]) {
    this.DisplayMeals = [];
    if (this.areaFilterString.length > 0 && this.categoryFilterString.length > 0) {
      for (let i = 0; i < array.length; i++) {
        if (this.areaFilterString.find((item) => item == array[i].area) == undefined) {
        } else {
          this.categoryFilterString.find((item) => item == array[i].category) == undefined
            ? ''
            : this.DisplayMeals.push(array[i]);
        }
      }
    } else if (this.areaFilterString.length > 0 || this.categoryFilterString.length > 0) {
      for (let i = 0; i < array.length; i++) {
        this.areaFilterString.find((item) => item == array[i].area) == undefined
          ? ''
          : this.DisplayMeals.push(array[i]);
      }
      for (let a = 0; a < array.length; a++) {
        this.categoryFilterString.find((item) => item == array[a].category) == undefined
          ? ''
          : this.DisplayMeals.push(array[a]);
      }
    } else {
      this.DisplayMeals = this.allMeals;
    }
  }

  findRecommendations() {
    this.DisplayMeals = [];
    let TempMeals: Meal[] = [];
    for (let i = 0; i < this.ingredientsFilter.length; i++) {
      this.allMeals.map((meal) =>
        meal.ingredients.map((ingredient) =>
          ingredient.name == this.ingredientsFilter[i] ? TempMeals.push(meal) : console.log('false')
        )
      );
    }
    this.DisplayMeals = TempMeals.filter((element, index) => {
      return TempMeals.indexOf(element) === index;
    });
  }

  mounted() {
    mealService.getAll().then((meals) => {
      this.allMeals = meals;
      meals.forEach((meal) => Push_to_allMeals(meal));
      this.SortByPopular();
    });

    mealService.getAllCategories().then((categories) => {
      this.categories = categories;
    });

    mealService.getAllAreas().then((areas) => {
      this.areas = areas;
    });

    mealService.getAllIngredients().then((ingredients) => {
      this.ingredients = ingredients.map((e) => e.ingredient);
      this.ingredentsWithID = ingredients;
    });
    window.addEventListener('resize', () => {
      this.forceUpdate();
    });
  }
}
