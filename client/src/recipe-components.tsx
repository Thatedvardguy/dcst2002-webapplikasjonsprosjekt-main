import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, CardFrontPage } from './widgets';
import mealService, { Meal } from './recipe-service';
import { createHashHistory } from 'history';
import {
  loggedIn,
  siteUsername,
  siteUserId,
  userLikedMeals,
  localShoppingCart,
  Set_localShoppingCart,
} from './global-variables';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class ShowRecipe extends Component<{ match: { params: { id: number } } }> {
  meal: Meal = {
    id: 0,
    name: '',
    drink: null,
    category: '',
    area: '',
    instructions: '',
    thumb: null,
    youtube: null,
    likes: 0,
    ingredients: [
      {
        name: '',
        number: 0,
        abbreviation: '',
      },
    ],
  };

  liked: boolean = false;
  isLoadingCheckbox: boolean = false;

  portions: number = 1;
  mealIngredients: { name: string; number: number | null; abbreviation: string }[] = [];

  render(): React.ReactNode {
    const toggleLike = async () => {
      this.isLoadingCheckbox = true;
      this.liked = !this.liked;
      if (!this.liked) {
        try {
          await mealService.removeLike(siteUserId, this.meal.id);
          this.meal.likes = this.meal.likes - 1;
          userLikedMeals.splice(
            userLikedMeals.findIndex((value) => value == this.props.match.params.id),
            1
          );
        } catch (error) {
          this.liked = true;
          console.error(error);
        } finally {
          this.isLoadingCheckbox = false;
        }
      } else {
        try {
          await mealService.giveLike(siteUserId, this.meal.id);
          this.meal.likes = this.meal.likes + 1;
          userLikedMeals.push(this.props.match.params.id);
        } catch (error) {
          this.liked = false;
          console.error(error);
        } finally {
          this.isLoadingCheckbox = false;
        }
      }
    };

    return (
      <>
        {this.meal.id > 0 ? (
          <div
            style={{
              display: 'block',
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '800px',
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <Row>
              {this.meal.thumb ? <img src={this.meal.thumb} alt={this.meal.name}></img> : ''}
            </Row>
            <div className="border border-success">
              <Card
                title={
                  <div style={{ textAlign: 'center' }}>
                    <i>{this.meal.name}</i>
                  </div>
                }
              >
                <hr />
                <Row>
                  <i>
                    <h3>Category: {this.meal.category}</h3>
                    <h3>Region: {this.meal.area}</h3>
                    <h3>
                      Likes: {this.meal.likes}&nbsp;
                      <img src="like.jpg" />
                    </h3>
                    {loggedIn ? (
                      <h4>
                        Like Recipe?{' '}
                        <Form.Checkbox
                          checked={this.liked}
                          onChange={toggleLike}
                          disabled={this.isLoadingCheckbox}
                        ></Form.Checkbox>
                        <br />
                        <Button.Dark
                          onClick={() =>
                            history.push('/recipes/' + this.props.match.params.id + '/edit')
                          }
                        >
                          <i>Edit Recipe</i>
                        </Button.Dark>
                        <Button.Danger
                          onClick={() => {
                            confirm('Are you sure? This action will permanently delete this meal!')
                              ? (mealService.delete(this.props.match.params.id), history.push('/'))
                              : console.log('cancelled');
                          }}
                        >
                          Delete Recipe
                        </Button.Danger>
                      </h4>
                    ) : (
                      ''
                    )}
                  </i>
                </Row>
                <Row>
                  <CardFrontPage title="Ingredients">
                    <Row>
                      <h2>
                        <i>Portions: </i>
                      </h2>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button.Rounded
                          red
                          onClick={() => {
                            if (this.portions > 1) {
                              this.portions -= 1;
                              this.UpdatePortions();
                            }
                          }}
                        >
                          -
                        </Button.Rounded>
                        <h4 style={{ width: '30px' }}>{this.portions}</h4>
                        <Button.Rounded
                          onClick={() => {
                            this.portions += 1;
                            this.UpdatePortions();
                          }}
                        >
                          +
                        </Button.Rounded>
                      </div>
                      <hr />
                    </Row>

                    <h3>
                      {this.mealIngredients.map((ingredient) => (
                        <li key={ingredient.name}>
                          {ingredient.name}: {ingredient.number} {ingredient.abbreviation}
                        </li>
                      ))}

                      <Button.Success
                        onClick={() => {
                          if (!loggedIn)
                            return Alert.info('You need to be logged in to use this feature');
                          this.mealIngredients.forEach((element) => {
                            localShoppingCart.push({
                              name: element.name,
                              number: Number(element.number),
                              abbreviation: element.abbreviation,
                            });
                          });
                          Alert.info('Ingredients added to cart!');
                        }}
                      >
                        Add Ingredients to Shopping Cart
                      </Button.Success>
                    </h3>
                  </CardFrontPage>
                </Row>
                <Row>
                  <h1 style={{ textAlign: 'center' }}>
                    <i>Instructions:</i>
                  </h1>
                  <hr />
                  <Row>
                    <Column>{this.meal.instructions}</Column>
                  </Row>
                </Row>
              </Card>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }

  UpdatePortions() {
    this.mealIngredients = [];
    this.meal.ingredients.map((res) => {
      let number: number | null = res.number;
      number != null && this.portions > 0 ? (number = number * this.portions) : false;
      this.mealIngredients.push({ name: res.name, number, abbreviation: res.abbreviation });
    });
  }

  mounted() {
    mealService.get(this.props.match.params.id).then((meal) => {
      this.meal = meal;

      this.meal.ingredients.map((ingredient) => this.mealIngredients.push(ingredient));
      this.liked = userLikedMeals.some((x) => x == this.meal.id);
    });
  }
}
type NewMeal = {
  name: string;
  drink: string | null;
  category: number;
  area: number;
  instructions: string;
  thumb: string | null;
  youtube: string | null;
  ingredients: { name: string; number: number | null; abbreviation: number }[];
};

export class CreateRecipe extends Component {
  meal: NewMeal = {
    name: '',
    drink: null,
    category: 0,
    area: 0,
    instructions: '',
    thumb: null,
    youtube: null,
    ingredients: [
      {
        name: '',
        number: 0,
        abbreviation: 0,
      },
    ],
  };
  newImage: string = 'https://via.placeholder.com/800x300';
  newMealIngredients: [{ name: string; number: number | null; abbreviation: number }] = [
    { name: '', number: 0, abbreviation: 0 },
  ];
  DisplayMealIngredients: [{ name: string; number: number | null; displayAbbreviation: string }] = [
    { name: '', number: 0, displayAbbreviation: '' },
  ];

  ingredientName: string = '';
  ingredientNumber: number = 0;
  ingredientMeasurement: number = 0;

  allMeasurements: { id: number; abbreviation: string; singular: string; plural: string }[] = [];
  allCategories: { id: number; category: string }[] = [];
  allAreas: { id: number; area: string }[] = [];

  render(): React.ReactNode {
    return (
      <div
        style={{
          display: 'block',
          textAlign: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '800px',
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Row>
          {
            <img
              src={this.meal.thumb != null ? this.meal.thumb : this.newImage}
              alt={'New Recipe'}
            ></img>
          }
        </Row>
        <div className="border border-success">
          <h3>
            Add Image (Optional):
            <Form.Input
              placeholder="Enter new image url here"
              type="text"
              value={this.meal.thumb != null ? this.meal.thumb : this.newImage}
              onChange={(event) => {
                this.meal.thumb = event.currentTarget.value;
              }}
            />
          </h3>
          <Card title={''}>
            <h2>Add Recipe Name (Required):</h2>
            <Form.Input
              placeholder="Enter new Recipe name here"
              type="text"
              value={this.meal.name}
              onChange={(event) => {
                this.meal.name = event.currentTarget.value;
              }}
            />
            <hr />
            <Row>
              <i>
                <h3>
                  Category (Required):{'  '}
                  <Form.Select
                    value={this.meal.category}
                    onChange={(event) => {
                      this.meal.category = Number(event.currentTarget.value);
                    }}
                  >
                    <option></option>
                    {this.allCategories.map((element) => {
                      return (
                        <option value={element.id} key={element.id}>
                          {element.category}
                        </option>
                      );
                    })}
                  </Form.Select>
                </h3>
                <h3>
                  Region (Required):{'  '}
                  <Form.Select
                    value={this.meal.area}
                    onChange={(event) => {
                      this.meal.area = Number(event.currentTarget.value);
                    }}
                  >
                    <option></option>
                    {this.allAreas.map((element) => {
                      return (
                        <option value={element.id} key={element.id}>
                          {element.area}
                        </option>
                      );
                    })}
                  </Form.Select>
                </h3>
                <h3>
                  Add Drink? (Optional):{'  '}
                  <Form.Input
                    type="text"
                    value={this.meal.drink ? this.meal.drink : ''}
                    onChange={(event) => {
                      this.meal.drink = event.currentTarget.value;
                    }}
                  ></Form.Input>
                </h3>
              </i>
            </Row>
            <Row>
              <CardFrontPage title="Ingredients">
                <br />
                <li style={{ display: 'flex', flexDirection: 'row' }}>
                  <Form.Input
                    style={{ width: '40%' }}
                    type="text"
                    value={this.ingredientName}
                    onChange={(event) => {
                      this.ingredientName = event.currentTarget.value;
                    }}
                  />
                  <Form.Input
                    style={{ width: '15%' }}
                    type="number"
                    value={this.ingredientMeasurement == 16 ? 0 : this.ingredientNumber}
                    disabled={this.ingredientMeasurement == 16}
                    onChange={(event) => {
                      this.ingredientNumber = Number(event.currentTarget.value);
                    }}
                  />
                  <Form.Select
                    style={{ width: '15%' }}
                    value={this.ingredientMeasurement}
                    onChange={(event) => {
                      this.ingredientMeasurement = Number(event.currentTarget.value);
                    }}
                  >
                    <option>---</option>
                    {this.allMeasurements.map((element) => {
                      return (
                        <option value={element.id} key={element.id}>
                          {element.abbreviation}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Button.Dark
                    onClick={() => {
                      this.AddIngredient();
                    }}
                  >
                    Add
                  </Button.Dark>
                </li>
                <hr />
                <h3>
                  {this.DisplayMealIngredients.map((ingredient, i) => (
                    <li key={i}>
                      {ingredient.name}: {ingredient.number} {ingredient.displayAbbreviation}{' '}
                      <Button.Danger
                        small
                        onClick={() => {
                          this.newMealIngredients.splice(i, 1);
                          this.DisplayMealIngredients.splice(i, 1);
                        }}
                      >
                        X
                      </Button.Danger>
                    </li>
                  ))}
                </h3>
              </CardFrontPage>
            </Row>
            <Row>
              <h1 style={{ textAlign: 'center' }}>
                <i>Instructions (Required):</i>
              </h1>
              <hr />
              <Row>
                <Form.Textarea
                  placeholder="Write instructions here: "
                  type="text"
                  value={this.meal.instructions}
                  onChange={(event) => {
                    this.meal.instructions = event.currentTarget.value;
                  }}
                />
              </Row>
              <Row>
                <h3>
                  <Button.Success
                    onClick={() => {
                      this.save();
                    }}
                  >
                    Post Recipe
                  </Button.Success>
                  {'   '}
                  <Button.Danger
                    onClick={() => {
                      history.push('/');
                    }}
                  >
                    Discard Recipe
                  </Button.Danger>
                </h3>
              </Row>
            </Row>
          </Card>
        </div>
      </div>
    );
  }

  save() {
    this.meal.ingredients = this.newMealIngredients;

    if (
      this.meal.name != '' &&
      this.meal.category != 0 &&
      this.meal.area != 0 &&
      this.meal.instructions != ''
    ) {
      mealService
        .create(
          this.meal.name,
          this.meal.drink,
          this.meal.category,
          this.meal.area,
          this.meal.instructions,
          this.meal.thumb,
          this.meal.youtube,
          this.meal.ingredients
        )
        .then(() => history.push('/'));
    }
  }

  getMeasurement(id: number) {
    for (let i = 0; i < this.allMeasurements.length; i++) {
      if (this.allMeasurements[i].id == id) {
        return this.allMeasurements[i].abbreviation;
      }
    }
    return '';
  }

  isUnique(name: string) {
    for (let i = 0; i < this.newMealIngredients.length; i++) {
      if (this.newMealIngredients[i].name == name) {
        return false;
      }
    }
    return true;
  }

  AddIngredient() {
    if (
      this.ingredientName != '' &&
      (this.ingredientNumber > 0 || this.ingredientMeasurement == 16) &&
      this.ingredientMeasurement != 0
    ) {
      let number: number | null = 0;
      this.isUnique(this.ingredientName)
        ? (this.ingredientMeasurement == 16 ? (number = null) : (number = this.ingredientNumber),
          this.newMealIngredients.push({
            name: this.ingredientName,
            number: number,
            abbreviation: this.ingredientMeasurement,
          }),
          this.DisplayMealIngredients.push({
            name: this.ingredientName,
            number: number,
            displayAbbreviation: this.getMeasurement(this.ingredientMeasurement),
          }))
        : Alert.danger('Duplicate ingredients not valid');

      this.ingredientName = '';
      this.ingredientNumber = 0;
      this.ingredientMeasurement = 0;
    } else Alert.danger('Ingredient not valid');
  }

  mounted() {
    mealService.getAllCategories().then((categories) => {
      this.allCategories = categories;
    });

    mealService.getAllAreas().then((areas) => {
      this.allAreas = areas;
    });
    mealService.getAllMeasurements().then((response) => {
      this.allMeasurements = response;
    });
    this.newMealIngredients.splice(0, 1);
    this.DisplayMealIngredients.splice(0, 1);
  }
}

export class EditRecipe extends Component<{ match: { params: { id: number } } }> {
  meal: Meal = {
    id: 0,
    name: '',
    drink: null,
    category: '',
    area: '',
    instructions: '',
    thumb: null,
    youtube: null,
    likes: 0,
    ingredients: [
      {
        name: '',
        number: null,
        abbreviation: '',
      },
    ],
  };
  placeholderImage: string = 'https://via.placeholder.com/800x300';
  MealIngredientsID: [{ name: string; number: number | null; abbreviation: number }] = [
    { name: '', number: 0, abbreviation: 0 },
  ];

  ingredientName: string = '';
  ingredientNumber: number = 0;
  ingredientMeasurement: string = '---';

  allMeasurements: { id: number; abbreviation: string; singular: string; plural: string }[] = [];
  allCategories: { id: number; category: string }[] = [];
  allAreas: { id: number; area: string }[] = [];

  render(): React.ReactNode {
    return (
      <>
        {this.meal.id > 0 ? (
          <div
            style={{
              display: 'block',
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '800px',
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <Row>
              {
                <img
                  src={this.meal.thumb != null ? this.meal.thumb : this.placeholderImage}
                  alt={'Edit Recipe'}
                ></img>
              }
            </Row>
            <div className="border border-success">
              <h3>
                Image (Optional):
                <Form.Input
                  placeholder="Enter new image url here"
                  type="text"
                  value={this.meal.thumb != null ? this.meal.thumb : this.placeholderImage}
                  onChange={(event) => {
                    this.meal.thumb = event.currentTarget.value;
                  }}
                />
              </h3>
              <Card title={''}>
                <h2>Add Recipe Name (Required):</h2>
                <Form.Input
                  placeholder="Enter new Recipe name here"
                  type="text"
                  value={this.meal.name}
                  onChange={(event) => {
                    this.meal.name = event.currentTarget.value;
                  }}
                />
                <hr />
                <Row>
                  <i>
                    <h3>
                      Category (Required):{'  '}
                      <Form.Select
                        value={this.meal.category}
                        onChange={(event) => {
                          this.meal.category = event.currentTarget.value;
                        }}
                      >
                        <option></option>
                        {this.allCategories.map((element) => {
                          return (
                            <option value={element.category} key={element.id}>
                              {element.category}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </h3>
                    <h3>
                      Region (Required):{'  '}
                      <Form.Select
                        value={this.meal.area}
                        onChange={(event) => {
                          this.meal.area = event.currentTarget.value;
                        }}
                      >
                        <option></option>
                        {this.allAreas.map((element) => {
                          return (
                            <option value={element.area} key={element.id}>
                              {element.area}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </h3>
                    <h3>
                      Add Drink? (Optional):{'  '}
                      <Form.Input
                        type="text"
                        value={this.meal.drink ? this.meal.drink : ''}
                        onChange={(event) => {
                          this.meal.drink = event.currentTarget.value;
                        }}
                      ></Form.Input>
                    </h3>
                  </i>
                </Row>
                <Row>
                  <CardFrontPage title="Ingredients">
                    <br />
                    <li style={{ display: 'flex', flexDirection: 'row' }}>
                      <Form.Input
                        style={{ width: '40%' }}
                        type="text"
                        value={this.ingredientName}
                        onChange={(event) => {
                          this.ingredientName = event.currentTarget.value;
                        }}
                      />
                      <Form.Input
                        style={{ width: '15%' }}
                        type="number"
                        value={
                          this.ingredientMeasurement == 'as required' ? 0 : this.ingredientNumber
                        }
                        disabled={this.ingredientMeasurement == 'as required'}
                        onChange={(event) => {
                          this.ingredientNumber = Number(event.currentTarget.value);
                        }}
                      />
                      <Form.Select
                        style={{ width: '15%' }}
                        value={this.ingredientMeasurement}
                        onChange={(event) => {
                          this.ingredientMeasurement = event.currentTarget.value;
                        }}
                      >
                        <option>---</option>
                        {this.allMeasurements.map((element) => {
                          return (
                            <option value={element.abbreviation} key={element.id}>
                              {element.abbreviation}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Button.Dark
                        onClick={() => {
                          this.AddIngredient();
                        }}
                      >
                        Add
                      </Button.Dark>
                    </li>
                    <hr />
                    <h3>
                      {this.meal.ingredients.map((ingredient, i) => (
                        <li key={i}>
                          {ingredient.name}: {ingredient.number} {ingredient.abbreviation}{' '}
                          <Button.Danger
                            small
                            onClick={() => {
                              this.MealIngredientsID.splice(i, 1);
                              this.meal.ingredients.splice(i, 1);
                            }}
                          >
                            X
                          </Button.Danger>
                        </li>
                      ))}
                    </h3>
                  </CardFrontPage>
                </Row>
                <Row>
                  <h1 style={{ textAlign: 'center' }}>
                    <i>Instructions (Required):</i>
                  </h1>
                  <hr />
                  <Row>
                    <Form.Textarea
                      rows={5}
                      placeholder="Write instructions here: "
                      type="text"
                      value={this.meal.instructions}
                      onChange={(event) => {
                        this.meal.instructions = event.currentTarget.value;
                      }}
                    />
                  </Row>

                  <Row>
                    <h3>
                      <Button.Success
                        onClick={() => {
                          this.save();
                        }}
                      >
                        Post Recipe
                      </Button.Success>
                      {'   '}
                      <Button.Danger
                        onClick={() => {
                          history.push('/');
                        }}
                      >
                        Discard Changes
                      </Button.Danger>
                    </h3>
                  </Row>
                </Row>
              </Card>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
  save() {
    let ingredients = this.MealIngredientsID;
    let category = Number(
      this.allCategories.find((item) => item.category == this.meal.category)?.id
    );
    let area = Number(this.allAreas.find((item) => item.area == this.meal.area)?.id);
    if (this.meal.name != '' && category != 0 && area != 0 && this.meal.instructions != '') {
      mealService
        .edit(
          this.meal.id,
          this.meal.name,
          this.meal.drink,
          category,
          area,
          this.meal.instructions,
          this.meal.thumb,
          this.meal.youtube,
          ingredients
        )
        .then(() => history.push('/'));
    }
  }

  getMeasurement(id: number) {
    for (let i = 0; i < this.allMeasurements.length; i++) {
      if (this.allMeasurements[i].id == id) {
        return this.allMeasurements[i].abbreviation;
      }
    }
    return '';
  }
  getMeasurementID(abbreviation: string) {
    for (let i = 0; i < this.allMeasurements.length; i++) {
      if (this.allMeasurements[i].abbreviation == abbreviation) {
        return this.allMeasurements[i].id;
      }
    }
    return 0;
  }

  isUnique(name: string) {
    for (let i = 0; i < this.MealIngredientsID.length; i++) {
      if (this.MealIngredientsID[i].name == name) {
        return false;
      }
    }
    return true;
  }

  AddIngredient() {
    if (
      this.ingredientName != '' &&
      (this.ingredientNumber > 0 || this.ingredientMeasurement == 'as required') &&
      this.ingredientMeasurement != '---'
    ) {
      let number: number | null = 0;
      this.isUnique(this.ingredientName)
        ? (this.ingredientMeasurement == 'as required'
            ? (number = null)
            : (number = this.ingredientNumber),
          this.MealIngredientsID.push({
            name: this.ingredientName,
            number: number,
            abbreviation: this.getMeasurementID(this.ingredientMeasurement),
          }),
          this.meal.ingredients.push({
            name: this.ingredientName,
            number: number,
            abbreviation: this.ingredientMeasurement,
          }))
        : Alert.danger('Duplicate ingredients not valid');

      this.ingredientName = '';
      this.ingredientNumber = 0;
      this.ingredientMeasurement = '---';
    } else Alert.danger('Ingredient not valid');
  }

  mounted() {
    mealService.get(this.props.match.params.id).then(
      (res) => (
        (this.meal = res),
        this.MealIngredientsID.pop(),
        this.meal.ingredients.map((ingr) => {
          this.MealIngredientsID.push({
            name: ingr.name,
            number: ingr.number,
            abbreviation: this.getMeasurementID(ingr.abbreviation),
          });
        })
      )
    );

    mealService.getAllCategories().then((categories) => {
      this.allCategories = categories;
    });

    mealService.getAllAreas().then((areas) => {
      this.allAreas = areas;
    });
    mealService.getAllMeasurements().then((response) => {
      this.allMeasurements = response;
    });
    this.MealIngredientsID.splice(0, 1);
  }
}

export class ShoppingCart extends Component {
  userShoppingCart: { name: string; number: number | null; abbreviation: string }[] = [];
  render(): React.ReactNode {
    return (
      <Card title={'Shopping Cart for user: ' + siteUsername}>
        <br />
        <Row>
          <Column>
            <div
              className="border border-success"
              style={{
                textAlign: 'center',
                width: '500px',
                backgroundImage: `url(paper.jpg)`,
              }}
            >
              <br />
              <br />
              <br />
              {this.userShoppingCart.map((element, index) => {
                return (
                  <Row>
                    <h2>
                      <li key={element.name + element.abbreviation}>
                        {element.name}:{' '}
                        {element.number != null && element.number > 0 ? element.number : ''} {'  '}
                        {element.abbreviation}
                        {'  '}
                        <Button.Danger
                          onClick={() => {
                            this.userShoppingCart.splice(index, 1);
                          }}
                        >
                          X
                        </Button.Danger>
                      </li>
                    </h2>
                  </Row>
                );
              })}
            </div>
            <Button.Danger
              onClick={() => {
                confirm('Are you sure? This will reset the entire shopping cart')
                  ? (this.userShoppingCart = [])
                  : console.log('cancelled');
              }}
            >
              Empty Cart
            </Button.Danger>
          </Column>
        </Row>
      </Card>
    );
  }

  mounted(): void {
    let results: { name: string; number: number | null; abbreviation: string }[] = [];
    localShoppingCart.forEach(function (this: typeof localShoppingCart, a: any) {
      if (!this[a.name + a.abbreviation]) {
        this[a.name + a.abbreviation] = {
          name: a.name,
          number: null,
          abbreviation: a.abbreviation,
        };
        results.push(this[a.name + a.abbreviation]);
      }
      this[a.name + a.abbreviation].number += a.number;
    }, Object.create(null));
    this.userShoppingCart = results;
  }
  beforeUnmount(): void {
    Set_localShoppingCart(this.userShoppingCart);
  }
}
