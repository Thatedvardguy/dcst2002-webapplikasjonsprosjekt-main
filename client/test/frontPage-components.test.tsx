import * as React from 'react';
import { Menu, FrontPageShowRecipe, FrontPage } from '../src/frontPage-components';
import { Meal } from '../src/recipe-service';
import { shallow } from 'enzyme';
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
import TextInput from 'react-autocomplete-input';

const meals: Meal[] = [
  {
    id: 1,
    name: 'Oppskrift1',
    drink: null,
    category: 'Breakfast',
    area: 'Italian',
    instructions: 'Blah Blah',
    thumb: null,
    youtube: null,
    likes: 10,
    ingredients: [
      {
        name: 'Tomato',
        number: 5,
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
const ingredients = ['Tomato', 'Flour', 'Butter'];

jest.mock('../src/recipe-service', () => {
  class RecipeService {
    get() {
      return Promise.resolve(meals[0]);
    }

    getAll() {
      return Promise.resolve(meals);
    }

    getAllCategories() {
      return Promise.resolve(categories);
    }
    getAllAreas() {
      return Promise.resolve(areas);
    }
    getAllIngredients() {
      return Promise.resolve(ingredients);
    }
  }
  return new RecipeService();
});

describe('Menu tests', () => {
  test('Menu draws correctly', (done) => {
    const wrapper = shallow(<Menu />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavBarx
            brand={
              <h2>
                <b>&nbsp;MatMania</b>
              </h2>
            }
          >
            <NavBarx.Link to="/newrecipe">Add Recipe</NavBarx.Link>
            <NavBarx.Link to="/login">Log in</NavBarx.Link>
            <NavBarx.Link to="/login">Shopping Cart</NavBarx.Link>
          </NavBarx>,
        ])
      ).toEqual(true);
      done();
    });
  });
});

describe('FrontPage-Components DRAWING tests', () => {
  test('FrontPage draws correctly', (done) => {
    const wrapper = shallow(<FrontPage />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <Card title="MatMania">
            <Row>
              <hr />
              <Column>
                <h2>
                  <i>Filters</i>
                </h2>
                <DropDownMenu title="Area" width={window.innerWidth / 4.5}>
                  <Row key={1}>
                    <Column>
                      <DropDownMenu.Element value="Area" id={1}>
                        Italian
                        <Form.Checkbox checked={false} onChange={() => {}} />
                      </DropDownMenu.Element>
                    </Column>
                  </Row>
                  <Row key={1}>
                    <Column>
                      <DropDownMenu.Element value="Area" id={2}>
                        Norwegian
                        <Form.Checkbox checked={false} onChange={() => {}} />
                      </DropDownMenu.Element>
                    </Column>
                  </Row>
                </DropDownMenu>
                <DropDownMenu title="Category" width={window.innerWidth / 4.5}>
                  <Row key={1}>
                    <Column>
                      <DropDownMenu.Element value="Category" id={1}>
                        Dinner
                        <Form.Checkbox checked={false} onChange={() => {}} />
                      </DropDownMenu.Element>
                    </Column>
                  </Row>
                  <Row key={2}>
                    <Column>
                      <DropDownMenu.Element value="Category" id={2}>
                        Breakfast
                        <Form.Checkbox checked={false} onChange={() => {}} />
                      </DropDownMenu.Element>
                    </Column>
                  </Row>
                </DropDownMenu>
                <DropDownMenu title={'Ingredients'} width={window.innerWidth / 4.5}>
                  <TextInput options={ingredients}></TextInput>
                </DropDownMenu>
              </Column>
              <Column>
                <Row>
                  <h2>
                    <i>Search</i>
                  </h2>
                  <Row>
                    <Form.Input type="text" value={''} onChange={() => {}}></Form.Input>
                  </Row>
                  <Button.Success onClick={() => {}}>Search</Button.Success>
                  <Column>
                    <Button.Dark onClick={() => {}}>New</Button.Dark>
                    <Button.Dark onClick={() => {}}>Popular</Button.Dark>
                  </Column>
                </Row>
                <Row>
                  <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
                    <Row>
                      <FrontPageShowRecipe meal={meals[0]} />
                    </Row>
                    <Row>
                      <FrontPageShowRecipe meal={meals[1]} />
                    </Row>
                  </Scrollbar>
                </Row>
              </Column>
            </Row>
          </Card>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('FrontPageShowRecipe draws correctly', (done) => {
    const wrapper = shallow(<FrontPageShowRecipe meal={meals[0]} />);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <CardFrontPage title="Oppskrift1">
            <hr />
            <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around' }}>
              <Column width={7}></Column>
              <Column width={4}>
                <Row>
                  <b>Region:</b>
                  <ul>{meals[0].area}</ul>
                </Row>
                <Row>
                  <b>Category:</b>
                  <ul>{meals[0].category}</ul>
                </Row>
                <Row>
                  <b>Likes:</b>
                  <ul>
                    {meals[0].likes}
                    &nbsp;
                    <img src="like.jpg" />
                  </ul>
                </Row>
                <Row>
                  <Column>
                    <Button.Dark onClick={() => {}}>Go to Recipe</Button.Dark>
                  </Column>
                </Row>
              </Column>
            </div>
          </CardFrontPage>,
        ])
      ).toEqual(true);
      done();
    });
  });
});

describe('FrontPage-Components FUNCTION tests', () => {
  test('FrontPageShowRecipe button redirects to recipe', (done) => {
    const wrapper = shallow(<FrontPageShowRecipe meal={meals[0]} />);

    wrapper.find(Button.Dark).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes/1');
      done();
    });
  });
  test('Sort by new', (done) => {
    const wrapper = shallow(<FrontPage />);

    wrapper.find(Button.Dark).at(0).simulate('click');

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={2}>
                <FrontPageShowRecipe meal={meals[1]} />
              </Row>
              <Row key={1}>
                <FrontPageShowRecipe meal={meals[0]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Sort by popular', (done) => {
    const wrapper = shallow(<FrontPage />);

    wrapper.find(Button.Dark).at(1).simulate('click');

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={1}>
                <FrontPageShowRecipe meal={meals[0]} />
              </Row>
              <Row key={2}>
                <FrontPageShowRecipe meal={meals[1]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Filter by Area', (done) => {
    const wrapper = shallow(<FrontPage />);

    setTimeout(() => {
      console.log(wrapper.exists(Form.Checkbox));
      wrapper
        .find(Form.Checkbox)
        .at(0)
        .simulate('change', { currentTarget: { checked: true } });
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={meals[0].id}>
                <FrontPageShowRecipe meal={meals[0]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Filter by Category', (done) => {
    const wrapper = shallow(<FrontPage />);

    setTimeout(() => {
      console.log(wrapper.exists(Form.Checkbox));
      wrapper
        .find(Form.Checkbox)
        .at(2)
        .simulate('change', { currentTarget: { checked: true } });
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={meals[1].id}>
                <FrontPageShowRecipe meal={meals[1]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Filter by Area and Category', (done) => {
    const wrapper = shallow(<FrontPage />);

    setTimeout(() => {
      console.log(wrapper.exists(Form.Checkbox));
      wrapper
        .find(Form.Checkbox)
        .at(0)
        .simulate('change', { currentTarget: { checked: true } });
      wrapper
        .find(Form.Checkbox)
        .at(3)
        .simulate('change', { currentTarget: { checked: true } });
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={meals[0].id}>
                <FrontPageShowRecipe meal={meals[0]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Filter by Ingredient', (done) => {
    const wrapper = shallow(<FrontPage />);

    setTimeout(() => {
      wrapper.find(TextInput).simulate('select', 'Tomato,');
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={meals[0].id}>
                <FrontPageShowRecipe meal={meals[0]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Add / Remove Area in filter', (done) => {
    const wrapper = shallow(<FrontPage />);

    setTimeout(() => {
      console.log(wrapper.exists(Form.Checkbox));
      wrapper
        .find(Form.Checkbox)
        .at(0)
        .simulate('change', { currentTarget: { checked: true } });
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={meals[0].id}>
                <FrontPageShowRecipe meal={meals[0]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      wrapper
        .find(Form.Checkbox)
        .at(0)
        .simulate('change', { currentTarget: { checked: false } });
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={meals[0].id}>
                <FrontPageShowRecipe meal={meals[0]} />
              </Row>
              <Row key={meals[1].id}>
                <FrontPageShowRecipe meal={meals[1]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Add / Remove Category in filter', (done) => {
    const wrapper = shallow(<FrontPage />);

    setTimeout(() => {
      console.log(wrapper.exists(Form.Checkbox));
      wrapper
        .find(Form.Checkbox)
        .at(2)
        .simulate('change', { currentTarget: { checked: true } });
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={meals[1].id}>
                <FrontPageShowRecipe meal={meals[1]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      wrapper
        .find(Form.Checkbox)
        .at(2)
        .simulate('change', { currentTarget: { checked: false } });
      expect(
        wrapper.containsAllMatchingElements([
          <Row>
            <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
              <Row key={meals[0].id}>
                <FrontPageShowRecipe meal={meals[0]} />
              </Row>
              <Row key={meals[1].id}>
                <FrontPageShowRecipe meal={meals[1]} />
              </Row>
            </Scrollbar>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Search button', (done) => {
    const wrapper = shallow(<FrontPage />);
    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Oppskrift1' } });
    wrapper.find(Button.Success).simulate('click');
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Scrollbar width={window.innerWidth / 1.5} height={window.innerHeight / 1.6}>
            <Row>
              <FrontPageShowRecipe meal={meals[0]} />
            </Row>
          </Scrollbar>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Create 3 Alerts, delete nr.2', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.info('test');
    Alert.danger('test2');
    Alert.success('test3');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div key={1}>
              test
              <button />
            </div>
            <div key={2}>
              test2
              <button />
            </div>
            <div key={3}>
              test3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').at(1).simulate('click');

      expect(
        wrapper.matchesElement(
          <div>
            <div key={1}>
              test
              <button />
            </div>
            <div key={3}>
              test3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });
});
