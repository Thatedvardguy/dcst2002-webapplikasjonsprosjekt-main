import * as React from 'react';
import { Card, Row, Column, Form, Button, NavBar } from '../src/widgets';
import { createHashHistory } from 'history';
import { shallow } from 'enzyme';
import { LoginPage, UserPage, RegisterPage } from '../src/login-register-components';

const history = createHashHistory();
let globalv = require('../src/global-variables');
globalv.loggedIn = false;
globalv.siteUsername = '';
globalv.siteUserId = 0;
globalv.allMeals = [
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

jest.mock('../src/recipe-service', () => {
  class mealservice {
    login() {
      return Promise.resolve({ data: { id: 1 }, status: 200 });
    }

    getUsers() {
      return Promise.resolve([{ id: 1, username: 'Charlie123', password: 'Password123' }]);
    }
    createUser() {
      return Promise.resolve({ userId: 1 });
    }
    getUserLikes() {
      return Promise.resolve([1, 2, 3]);
    }
  }
  return new mealservice();
});

describe('Login Page tests', () => {
  test('Draws correctly', (done) => {
    const wrapper = shallow(<LoginPage />);
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <Card title="Welcome to MatMania">
            <Row>
              <Column>
                Log in or create a free account in order to: like, post or comment on recipies you
                like!
              </Column>
            </Row>
            <br />
            <br />
            <Row>
              <Column width={2}>Username:</Column>
              <Column>
                <Form.Input value="" type="string" onChange={() => {}} />
              </Column>
            </Row>
            <Row>
              <Column width={2}>Password:</Column>
              <Column>
                <Form.Input value="" type="password" onChange={() => {}} />
              </Column>
            </Row>
            <br />
            <Button.Light onClick={() => {}}>New Account?</Button.Light>
            &nbsp;
            <Button.Success onClick={() => {}}>Log in</Button.Success>
          </Card>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('Username input changes', (done) => {
    const wrapper = shallow(<LoginPage />);
    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="" type="string" />)).toEqual(true);

    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'test' } });

    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="test" type="string" />)).toEqual(
      true
    );
    done();
  });

  test('Password input changes', (done) => {
    const wrapper = shallow(<LoginPage />);
    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="" type="password" />)).toEqual(true);

    wrapper
      .find(Form.Input)
      .at(1)
      .simulate('change', { currentTarget: { value: 'test' } });

    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="test" type="password" />)).toEqual(
      true
    );
    done();
  });

  test('Button "Log in" logs in and redirects', (done) => {
    const wrapper = shallow(<LoginPage />);

    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'Charlie123' } });
    wrapper
      .find(Form.Input)
      .at(1)
      .simulate('change', { currentTarget: { value: 'Password123' } });
    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      console.log(wrapper.debug());
      console.log(globalv);
      expect(globalv.loggedIn).toEqual(true);
      expect(globalv.siteUserId).toEqual(1);
      expect(globalv.siteUsername).toEqual('Charlie123');

      expect(location.hash).toEqual('#/');
      done();
    });
  });
  test('Button "New Account?" calls function on click-event', (done) => {
    const wrapper = shallow(<LoginPage />);
    wrapper.find(Button.Light).simulate('click');
    setTimeout(() => {
      expect(location.hash).toEqual('#/register');
      done();
    });
  });
});

describe('user Page tests', () => {
  test('Draws correctly logged in', (done) => {
    globalv.loggedIn = true;
    globalv.siteUserId = 1;
    globalv.siteUsername = 'Charlie123';
    const wrapper = shallow(<UserPage match={{ params: { username: 'Charlie123' } }} />);

    setTimeout(() => {
      console.log(wrapper.debug());
      expect(
        wrapper.containsAllMatchingElements([
          <Card title={'Welcome to MatMania, Charlie123'}>
            <Column>
              <Card title="">
                <Row>
                  <h3>Username: {globalv.siteUsername}</h3>
                </Row>
                {/*@ts-ignore */}
                <Button.Danger>Log out</Button.Danger>
              </Card>
              <Card title={'Liked recipes'}>
                <Row>
                  <Row>
                    <NavBar.Link to={`/recipes/1`}>
                      <div style={{ color: 'black' }}>Recipe: {'Oppskrift1'}</div>
                    </NavBar.Link>
                  </Row>
                  <Row>
                    <NavBar.Link to={`/recipes/2`}>
                      <div style={{ color: 'black' }}>Recipe: {'Oppskrift2'}</div>
                    </NavBar.Link>
                  </Row>
                </Row>
              </Card>
            </Column>
          </Card>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Button "Log out" calls function on click-event', (done) => {
    const wrapper = shallow(<UserPage match={{ params: { username: 'Charlie123' } }} />);
    wrapper.find(Button.Danger).simulate('click');
    setTimeout(() => {
      expect(globalv.loggedIn).toEqual(false);
      expect(globalv.siteUserId).toEqual(0);
      expect(globalv.siteUsername).toEqual('');
      expect(location.hash).toEqual('#/');
      history.push('#/register');
      done();
    });
  });
});

describe('register Page tests', () => {
  test('Draws correctly', (done) => {
    const wrapper = shallow(<RegisterPage />);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement([
          <Card title="Register New Account For MatMania">
            <Row>
              <Column>
                In order to create an account:
                <br />
                1. Enter desired username <br />
                2. Add a password <br />
                3. Confirm password
              </Column>
            </Row>
            <br />
            <br />
            <Row>
              <Column width={2}>Username:</Column>
              <Column>
                <Form.Input value="" type="string" onChange={() => {}} />
              </Column>
            </Row>
            <Row>
              <Column width={2}>Password:</Column>
              <Column>
                <Form.Input value="" type="password" onChange={() => {}} />
              </Column>
            </Row>
            <Row>
              <Column width={2}>Confirm Password:</Column>
              <Column>
                <Form.Input value="" type="password" onChange={() => {}} />
              </Column>
            </Row>
            <br />
            <Button.Success onClick={() => {}}>Create Account</Button.Success>
          </Card>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('Username input changes', (done) => {
    const wrapper = shallow(<RegisterPage />);
    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="" type="string" />)).toEqual(true);

    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'test' } });

    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="test" type="string" />)).toEqual(
      true
    );
    done();
  });

  test('Password input changes', (done) => {
    const wrapper = shallow(<RegisterPage />);
    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="" type="password" />)).toEqual(true);

    wrapper
      .find(Form.Input)
      .at(1)
      .simulate('change', { currentTarget: { value: 'test' } });

    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="test" type="password" />)).toEqual(
      true
    );
    done();
  });

  test('Password double check input changes', (done) => {
    const wrapper = shallow(<RegisterPage />);
    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="" type="password" />)).toEqual(true);

    wrapper
      .find(Form.Input)
      .at(2)
      .simulate('change', { currentTarget: { value: 'test' } });

    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="test" type="password" />)).toEqual(
      true
    );
    done();
  });

  test('Button "Create Account" fails, no username', (done) => {
    const wrapper = shallow(<RegisterPage />);

    wrapper
      .find(Form.Input)
      .at(1)
      .simulate('change', { currentTarget: { value: 'Password123' } });
    wrapper
      .find(Form.Input)
      .at(2)
      .simulate('change', { currentTarget: { value: 'Password' } });

    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(globalv.loggedIn).toEqual(false);
      expect(globalv.siteUserId).toBe(0);
      expect(globalv.siteUsername).toBe('');
      done();
    });
  });

  test('Button "Create Account" fails, no password given', (done) => {
    const wrapper = shallow(<RegisterPage />);

    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'Charlie123' } });
    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(globalv.loggedIn).toEqual(false);
      expect(globalv.siteUserId).toBe(0);
      expect(globalv.siteUsername).toBe('');
      done();
    });
  });

  test('Button "Create Account" fails, password mismatch', (done) => {
    const wrapper = shallow(<RegisterPage />);
    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'Peter123' } });
    wrapper
      .find(Form.Input)
      .at(1)
      .simulate('change', { currentTarget: { value: 'Password123' } });
    wrapper
      .find(Form.Input)
      .at(2)
      .simulate('change', { currentTarget: { value: 'Password' } });
    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(globalv.loggedIn).toEqual(false);
      expect(globalv.siteUserId).toBe(0);
      expect(globalv.siteUsername).toBe('');

      done();
    });
  });

  test('Button "Create Account" creates account and logs in', (done) => {
    const wrapper = shallow(<RegisterPage />);
    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'Peter123' } });
    wrapper
      .find(Form.Input)
      .at(1)
      .simulate('change', { currentTarget: { value: 'Password123' } });
    wrapper
      .find(Form.Input)
      .at(2)
      .simulate('change', { currentTarget: { value: 'Password123' } });
    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(globalv.loggedIn).toEqual(true);
      expect(globalv.siteUserId).toBe(1);
      expect(globalv.siteUsername).toBe('Peter123');

      done();
    });
  });

  test('Button "Create Account" creates account and logs in', (done) => {
    const wrapper = shallow(<RegisterPage />);
    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'Peter123' } });
    wrapper
      .find(Form.Input)
      .at(1)
      .simulate('change', { currentTarget: { value: 'Password123' } });
    wrapper
      .find(Form.Input)
      .at(2)
      .simulate('change', { currentTarget: { value: 'Password123' } });
    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(globalv.loggedIn).toEqual(true);
      expect(globalv.siteUserId).toBe(1);
      expect(globalv.siteUsername).toBe('Peter123');

      done();
    });
  });

  // /* FEIL */
  // test('Button "Create Account" fails, duplicate user', (done) => {
  //   const wrapper = shallow(<RegisterPage />);

  //   wrapper
  //     .find(Form.Input)
  //     .at(0)
  //     .simulate('change', { currentTarget: { value: 'Charlie123' } });
  //   wrapper
  //     .find(Form.Input)
  //     .at(1)
  //     .simulate('change', { currentTarget: { value: 'Password123' } });
  //   wrapper
  //     .find(Form.Input)
  //     .at(2)
  //     .simulate('change', { currentTarget: { value: 'Password123' } });
  //   wrapper.find(Button.Success).simulate('click');

  //   setTimeout(() => {
  //     expect(location.hash).toEqual('#/#/register');
  //     expect(loggedIn).toEqual(false);
  //     expect(siteUserId).toBe(0);
  //     expect(siteUsername).toBe('');
  //     expect(wrapper).toThrowError;

  //     history.goBack();
  //     done();
  //   });
  // });
});
