import * as React from 'react';
import { CreateRecipe, EditRecipe, ShoppingCart, ShowRecipe } from '../src/recipe-components';
import mealService, { Meal } from '../src/recipe-service';
import { mount, shallow } from 'enzyme';
import {
  Form,
  Button,
  Column,
  Row,
  Card,
  NavBarx,
  DropDownMenu,
  Scrollbar,
  CardFrontPage,
  Alert,
} from '../src/widgets';

const meals: Meal[] = [
  {
    id: 1,
    name: 'Baked Potato',
    drink: null,
    category: 'Sides',
    area: 'Norwegian',
    instructions:
      '1. Poke holes all over the potato 2. Wrap potato in aluminum foil and bake in a oven heated to 220 °C for 1-1 1/2 hours.3. Light cut the top of the potato with a knife and squeeze the middle (as shown in thumbnail).4. Let it cool slightly and serve with salt, butter or other condiments you prefer.',
    thumb: 'https://images.matprat.no/8cshhm38v6-jumbotron/large',
    youtube: null,
    likes: 1,
    ingredients: [
      {
        name: 'Potato',
        number: 1,
        abbreviation: '',
      },
    ],
  },
  {
    id: 2,
    name: 'Oppskrift2',
    drink: null,
    category: 'Dinner',
    area: 'Norwegian',
    instructions: 'Blah Blah Blah',
    thumb: null,
    youtube: null,
    likes: 5,
    ingredients: [
      {
        name: 'Butter',
        number: 5,
        abbreviation: 'tsp',
      },
    ],
  },
];
const categories = [
  { id: 1, category: 'Dinner' },
  { id: 2, category: 'Breakfast' },
];
const areas = [
  { id: 1, area: 'Italian' },
  { id: 2, area: 'Norwegian' },
];
const measurements = [
  { id: 1, abbreviation: '', singular: '', plural: '' },
  { id: 2, abbreviation: 'tsp', singular: 'tsp', plural: 'tsps' },
];
// const ingredients = ['Tomato', 'Flour', 'Butter'];

let likedrecipe: number[] = [];
let globalv = require('../src/global-variables');

jest.mock('../src/recipe-service', () => {
  class MealService {
    get() {
      return Promise.resolve(meals[0]);
    }

    getAll() {
      return Promise.resolve(meals);
    }

    create() {
      return Promise.resolve(
        meals.push({
          id: 3,
          name: 'Oppskrift3',
          drink: null,
          category: 'Dinner',
          area: 'Italian',
          instructions: 'Blah Blah Blah',
          thumb: null,
          youtube: null,
          likes: 5,
          ingredients: [
            {
              name: 'Butter',
              number: 5,
              abbreviation: 'tsp',
            },
          ],
        })
      );
    }

    edit() {
      return Promise.resolve(200);
    }

    delete() {
      return meals.splice(1, 1);
    }

    getAllCategories() {
      return Promise.resolve(categories);
    }
    getAllAreas() {
      return Promise.resolve(areas);
    }
    getAllMeasurements() {
      return Promise.resolve(measurements);
    }
    giveLike() {
      return Promise.resolve(likedrecipe.push(1));
    }
    removeLike() {
      return Promise.resolve(likedrecipe.splice(0, 1));
    }
  }
  return new MealService();
});

describe('ShowRecipe tests', () => {
  test('ShowRecipe draws correctly (Not logged in)', (done) => {
    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
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
              <img />
            </Row>
            <div className="border border-success">
              <Card
                title={
                  <div style={{ textAlign: 'center' }}>
                    <i>{meals[0].name}</i>
                  </div>
                }
              >
                <hr />
                <Row>
                  <i>
                    <h3>Category: Sides</h3>
                    <h3>Region: Norwegian</h3>
                    <h3>
                      Likes: {Number(1)}
                      <img />
                    </h3>
                    {''}
                  </i>
                </Row>
                <Row>
                  <CardFrontPage title="Ingredients">
                    <Row>
                      <h2>
                        <i>Portions: </i>
                      </h2>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {/*@ts-ignore */}
                        <Button.Rounded red>-</Button.Rounded>
                        <h4 style={{ width: '30px' }}>{Number(1)}</h4>
                        {/*@ts-ignore */}
                        <Button.Rounded>+</Button.Rounded>
                      </div>
                      <hr />
                    </Row>
                    <h3>
                      {meals[0].ingredients.map((ingredient) => (
                        <li key={ingredient.name}>
                          {ingredient.name}: {ingredient.number} {ingredient.abbreviation}
                        </li>
                      ))}
                      {/*@ts-ignore */}
                      <Button.Success>Add Ingredients to Shopping Cart</Button.Success>
                    </h3>
                  </CardFrontPage>
                </Row>
                <Row>
                  <h1 style={{ textAlign: 'center' }}>
                    <i>Instructions:</i>
                  </h1>
                  <hr />
                  <Row>
                    <Column>{meals[0].instructions}</Column>
                  </Row>
                </Row>
              </Card>
            </div>
          </div>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Edit button goes to /recipes/1/edit', (done) => {
    globalv.loggedIn = true;

    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Dark).simulate('click');
      expect(location.hash).toEqual('#/recipes/1/edit');

      done();
    });
  });
  test('Delete button deletes recipe and goes to homepage', (done) => {
    globalv.loggedIn = true;
    window.confirm = jest.fn().mockImplementation(() => meals.splice(1, 1));

    const wrapper = shallow(<ShowRecipe match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Danger).simulate('click');
      console.log(wrapper.debug());
      expect(meals.length).toEqual(1);
      expect(location.hash).toEqual('#/');
      done();
    });
  });
  test('Like button adds and removes like', (done) => {
    globalv.loggedIn = true;

    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.find(Form.Checkbox).simulate('change', { currentTarget: { checked: true } });
      expect(likedrecipe).toEqual([1]);
      wrapper.find(Form.Checkbox).simulate('change', { currentTarget: { checked: false } });
      expect(likedrecipe).toEqual([]);

      done();
    });
  });
  test('Add ingredients button adds ingredients', (done) => {
    globalv.loggedIn = true;
    globalv.siteUsername = 'admin';
    globalv.localShoppingCart = [];

    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      wrapper.find(Button.Success).simulate('click');
      expect(globalv.localShoppingCart).toEqual([{ name: 'Potato', number: 1, abbreviation: '' }]);

      done();
    });
  });
  test('Increase / Decrease portions', (done) => {
    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Rounded).at(1).simulate('click');
      expect(
        wrapper.containsAllMatchingElements([<h4 style={{ width: '30px' }}>{Number(2)}</h4>])
      ).toEqual(true);
      wrapper.find(Button.Rounded).at(0).simulate('click');
      expect(
        wrapper.containsAllMatchingElements([<h4 style={{ width: '30px' }}>{Number(1)}</h4>])
      ).toEqual(true);
      done();
    });
  });
});
describe('EditRecipe tests', () => {
  test('EditRecipe draws correctly', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    let test = [
      <Row>
        <img src="https://images.matprat.no/8cshhm38v6-jumbotron/large" alt="Edit Recipe" />
      </Row>,
      <h3>
        Image (Optional):
        {/*@ts-ignore */}
        <Form.Input />
      </h3>,
      <hr />,
      <Row>
        <i>
          <h3>
            Category (Required):{'  '}
            {/*@ts-ignore */}
            <Form.Select value={meals[0].category}>
              <option></option>
              {categories.map((element) => {
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
            {/*@ts-ignore */}
            <Form.Select value={meals[0].area}>
              <option></option>
              {areas.map((element) => {
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
            {/*@ts-ignore */}
            <Form.Input type="text" value={''}></Form.Input>
          </h3>
        </i>
      </Row>,
      <Row>
        <CardFrontPage title={'Ingredients'}>
          <br />
          <li style={{ display: 'flex', flexDirection: 'row' }}>
            {/*@ts-ignore */}
            <Form.Input type="text" value={''} />
            {/*@ts-ignore */}
            <Form.Input type="number" value={0} />
            {/*@ts-ignore */}
            <Form.Select>
              <option>---</option>
              <option>{''}</option>
              <option>tsp</option>
            </Form.Select>
            {/*@ts-ignore */}
            <Button.Dark>Add</Button.Dark>
          </li>
          <hr />
          <h3>
            {meals[0].ingredients.map((ingredient, i) => (
              <li key={i}>
                {ingredient.name}: {ingredient.number} {ingredient.abbreviation} {/*@ts-ignore */}
                <Button.Danger small>X</Button.Danger>
              </li>
            ))}
          </h3>
        </CardFrontPage>
      </Row>,
      <Row>
        <h1 style={{ textAlign: 'center' }}>
          <i>Instructions (Required):</i>
        </h1>
        <hr />
        <Row>
          {/*@ts-ignore */}
          <Form.Textarea />
        </Row>
        <Row>
          <h3>
            {/*@ts-ignore */}
            <Button.Success>Post Recipe</Button.Success>
            {'   '}
            {/*@ts-ignore */}
            <Button.Danger>Discard Changes</Button.Danger>
          </h3>
        </Row>
      </Row>,
    ];

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements(test)).toEqual(true);
      done();
    });
  });
  test('Can change values of Input/Select', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.find(Form.Input).at(0).props().value ==
          'https://images.matprat.no/8cshhm38v6-jumbotron/large'
      ).toEqual(true);
      expect(wrapper.find(Form.Input).at(1).props().value == 'Baked Potato').toEqual(true);
      expect(wrapper.find(Form.Select).at(0).props().value == 'Sides').toEqual(true);
      expect(wrapper.find(Form.Select).at(1).props().value == 'Norwegian').toEqual(true);
      expect(wrapper.find(Form.Input).at(2).props().value == '').toEqual(true);
      expect(wrapper.find(Form.Input).at(3).props().value == '').toEqual(true);
      expect(wrapper.find(Form.Input).at(4).props().value == 0).toEqual(true);
      expect(wrapper.find(Form.Select).at(2).props().value == '---').toEqual(true);
      expect(
        wrapper.find(Form.Textarea).props().value ==
          '1. Poke holes all over the potato 2. Wrap potato in aluminum foil and bake in a oven heated to 220 °C for 1-1 1/2 hours.3. Light cut the top of the potato with a knife and squeeze the middle (as shown in thumbnail).4. Let it cool slightly and serve with salt, butter or other condiments you prefer.'
      ).toEqual(true);

      wrapper
        .find(Form.Input)
        .at(0)
        .simulate('change', { currentTarget: { value: 'https://NewImage' } });

      wrapper
        .find(Form.Input)
        .at(1)
        .simulate('change', { currentTarget: { value: 'NewName' } });

      wrapper
        .find(Form.Select)
        .at(0)
        .simulate('change', { currentTarget: { value: 'Dinner' } });
      wrapper
        .find(Form.Select)
        .at(1)
        .simulate('change', { currentTarget: { value: 'Italian' } });
      wrapper
        .find(Form.Input)
        .at(2)
        .simulate('change', { currentTarget: { value: 'NewDrink' } });
      wrapper
        .find(Form.Input)
        .at(3)
        .simulate('change', { currentTarget: { value: 'IngrName' } });
      wrapper
        .find(Form.Input)
        .at(4)
        .simulate('change', { currentTarget: { value: 1 } });
      wrapper
        .find(Form.Select)
        .at(2)
        .simulate('change', { currentTarget: { value: 'tsp' } });
      wrapper
        .find(Form.Textarea)
        .simulate('change', { currentTarget: { value: 'NewInstructions' } });

      expect(wrapper.find(Form.Input).at(0).props().value == 'https://NewImage').toEqual(true);
      expect(wrapper.find(Form.Input).at(1).props().value == 'NewName').toEqual(true);
      expect(wrapper.find(Form.Select).at(0).props().value == 'Dinner').toEqual(true);
      expect(wrapper.find(Form.Select).at(1).props().value == 'Italian').toEqual(true);
      expect(wrapper.find(Form.Input).at(2).props().value == 'NewDrink').toEqual(true);
      expect(wrapper.find(Form.Input).at(3).props().value == 'IngrName').toEqual(true);
      expect(wrapper.find(Form.Input).at(4).props().value == 1).toEqual(true);
      expect(wrapper.find(Form.Select).at(2).props().value == 'tsp').toEqual(true);
      expect(wrapper.find(Form.Textarea).props().value == 'NewInstructions').toEqual(true);

      done();
    });
  });
  test('Edit button redirects to homepage', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      console.log(wrapper.debug());
      wrapper.find(Button.Success).simulate('click');
      expect(location.hash).toEqual('#/');
      done();
    });
  });
  test('Discard button redirects to homepage', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Danger).at(1).simulate('click');
      expect(location.hash).toEqual('#/');
      done();
    });
  });
  test('Can add / remove ingredient', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper
        .find(Form.Input)
        .at(3)
        .simulate('change', { currentTarget: { value: 'Salt' } });
      wrapper
        .find(Form.Input)
        .at(4)
        .simulate('change', { currentTarget: { value: 1 } });
      wrapper
        .find(Form.Select)
        .at(2)
        .simulate('change', { currentTarget: { value: 'tsp' } });
      wrapper.find(Button.Dark).simulate('click');
      expect(
        wrapper.containsAllMatchingElements([
          <h3>
            <li>
              {'Potato'}: {1} {''} {/*@ts-ignore */}
              <Button.Danger small>X</Button.Danger>
            </li>
            <li>
              {'Salt'}: {1} {'tsp'} {/*@ts-ignore */}
              <Button.Danger small>X</Button.Danger>
            </li>
          </h3>,
        ])
      ).toEqual(true);
      wrapper.find(Button.Danger).at(1).simulate('click');
      expect(
        wrapper.containsAllMatchingElements([
          <h3>
            <li>
              {'Potato'}: {1} {''} {/*@ts-ignore */}
              <Button.Danger small>X</Button.Danger>
            </li>
          </h3>,
        ])
      ).toEqual(true);

      done();
    });
  });
});

describe('CreateRecipe Tests', () => {
  test('CreateRecipe draws correctly', (done) => {
    const wrapper = shallow(<CreateRecipe />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <img src="https://via.placeholder.com/800x300" alt="New Recipe" />
          </Row>,
          <h3>
            Add Image (Optional):
            {/*@ts-ignore */}
            <Form.Input />
          </h3>,
          <hr />,
          <Row>
            <i>
              <h3>
                Category (Required):
                {'  '}
                {/*@ts-ignore */}
                <Form.Select>
                  <option></option>
                  <option>{'Dinner'}</option>
                  <option>{'Breakfast'}</option>
                </Form.Select>
              </h3>
              <h3>
                Region (Required):
                {'  '}
                {/*@ts-ignore */}
                <Form.Select>
                  <option></option>
                  <option>{'Italian'}</option>
                  <option>{'Norwegian'}</option>
                </Form.Select>
              </h3>
              <h3>
                Add Drink? (Optional):
                {'  '}
                {/*@ts-ignore */}
                <Form.Input />
              </h3>
            </i>
          </Row>,
          <CardFrontPage title={'Ingredients'}>
            <br />
            <li style={{ display: 'flex', flexDirection: 'row' }}>
              {/*@ts-ignore */}
              <Form.Input type="text" value={''} />
              {/*@ts-ignore */}
              <Form.Input type="number" value={0} />
              {/*@ts-ignore */}
              <Form.Select>
                <option>---</option>
                <option>{''}</option>
                <option>tsp</option>
              </Form.Select>
              {/*@ts-ignore */}
              <Button.Dark>Add</Button.Dark>
            </li>
            <hr />
            <h3 />
          </CardFrontPage>,
          <Row>
            <h1>
              <i>Instructions (Required):</i>
            </h1>
            <hr />
            <Row>
              {/*@ts-ignore */}
              <Form.Textarea />
            </Row>
            <Row>
              <h3>
                {/*@ts-ignore */}
                <Button.Success>Post Recipe</Button.Success>
                {'   '}
                {/*@ts-ignore */}
                <Button.Danger>Discard Recipe</Button.Danger>
              </h3>
            </Row>
          </Row>,
        ])
      ).toEqual(true);

      done();
    });
  });
  test('Can create recipes', (done) => {
    const wrapper = shallow(<CreateRecipe />, {
      wrappingComponent: Card,
    });

    setTimeout(() => {
      expect(
        wrapper.find(Form.Input).at(0).props().value == 'https://via.placeholder.com/800x300'
      ).toEqual(true);
      expect(wrapper.find(Form.Input).at(1).props().value == '').toEqual(true);
      expect(wrapper.find(Form.Select).at(0).props().value == 0).toEqual(true);
      expect(wrapper.find(Form.Select).at(1).props().value == 0).toEqual(true);
      expect(wrapper.find(Form.Input).at(2).props().value == '').toEqual(true);
      expect(wrapper.find(Form.Input).at(3).props().value == '').toEqual(true);
      expect(wrapper.find(Form.Input).at(4).props().value == 0).toEqual(true);
      expect(wrapper.find(Form.Select).at(2).props().value == 0).toEqual(true);
      expect(wrapper.find(Form.Textarea).props().value == '').toEqual(true);

      wrapper
        .find(Form.Input)
        .at(1)
        .simulate('change', { currentTarget: { value: 'Oppskrift3' } });

      wrapper
        .find(Form.Select)
        .at(0)
        .simulate('change', { currentTarget: { value: 1 } });
      wrapper
        .find(Form.Select)
        .at(1)
        .simulate('change', { currentTarget: { value: 1 } });
      wrapper
        .find(Form.Input)
        .at(2)
        .simulate('change', { currentTarget: { value: null } });
      wrapper
        .find(Form.Input)
        .at(3)
        .simulate('change', { currentTarget: { value: 'Butter' } });
      wrapper
        .find(Form.Input)
        .at(4)
        .simulate('change', { currentTarget: { value: 5 } });
      wrapper
        .find(Form.Select)
        .at(2)
        .simulate('change', { currentTarget: { value: 2 } });
      wrapper
        .find(Form.Textarea)
        .simulate('change', { currentTarget: { value: 'Blah Blah Blah' } });

      wrapper.find(Button.Dark).simulate('click');
      wrapper.find(Button.Success).simulate('click');

      expect(meals.length).toEqual(2);
      done();
    });
  });
  test('Can add / remove ingredients', (done) => {
    const wrapper = shallow(<CreateRecipe />);

    setTimeout(() => {
      expect(wrapper.find(Form.Input).at(3).props().value == '').toEqual(true);
      expect(wrapper.find(Form.Input).at(4).props().value == 0).toEqual(true);
      expect(wrapper.find(Form.Select).at(2).props().value == 0).toEqual(true);

      wrapper
        .find(Form.Input)
        .at(3)
        .simulate('change', { currentTarget: { value: 'Salt' } });
      wrapper
        .find(Form.Input)
        .at(4)
        .simulate('change', { currentTarget: { value: 1 } });
      wrapper
        .find(Form.Select)
        .at(2)
        .simulate('change', { currentTarget: { value: 2 } });

      wrapper.find(Button.Dark).simulate('click');

      expect(
        wrapper.containsAllMatchingElements([
          <h3>
            <li>
              {'Salt'}: {1} {'tsp'} {/*@ts-ignore */}
              <Button.Danger small>X</Button.Danger>
            </li>
          </h3>,
        ])
      ).toEqual(true);

      wrapper.find(Button.Danger).at(0).simulate('click');
      expect(wrapper.containsAllMatchingElements([<h3 />])).toEqual(true);
      done();
    });
  });
});
