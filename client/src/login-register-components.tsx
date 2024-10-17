import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, NavBar } from './widgets';
import { createHashHistory } from 'history';
import mealService, { Meal } from './recipe-service';
import {
  loggedIn,
  siteUsername,
  siteUserId,
  userLikedMeals,
  Set_login_status,
  Set_siteUsername,
  Set_siteUserId,
  Set_userLikedMeals,
  allMeals,
} from './global-variables';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class LoginPage extends Component {
  username: string = '';
  password: string = '';
  render() {
    return (
      <Card title="Welcome to MatMania">
        <Row>
          <Column>
            Log in or create a free account in order to: like, post or comment on recipies you like!
          </Column>
        </Row>
        <br />
        <br />
        <Row>
          <Column width={2}>Username:</Column>
          <Column>
            <Form.Input
              value={this.username}
              type="string"
              onChange={(event) => (this.username = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Row>
          <Column width={2}>Password:</Column>
          <Column>
            <Form.Input
              value={this.password}
              type="password"
              onChange={(event) => (this.password = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <br />
        <Button.Light
          onClick={() => {
            history.push('/register');
          }}
        >
          New Account?
        </Button.Light>
        &nbsp;
        <Button.Success
          onClick={() => {
            if (!this.username || this.username == null)
              return Alert.danger('Please type in a username and try again');
            if (!this.password || this.password == null)
              return Alert.danger('Please provide a password and try again');
            console.log(`Logging in with username: ${this.username}, password: ${this.password}`);
            mealService
              .login(this.username, this.password)
              .then((response: any) => {
                if (response.status === 200) {
                  Set_login_status(true);
                  Set_siteUsername(this.username);
                  Set_siteUserId(response.data.id);

                  history.push('/');
                  Alert.success(`Logged inn as user: ${this.username}.`);

                  mealService.getUserLikes(siteUserId).then((meals) => {
                    Set_userLikedMeals(meals);
                  });
                }
              })
              .catch((error) => {
                Alert.danger(error.response.data);
              });
          }}
        >
          Log in
        </Button.Success>
      </Card>
    );
  }
}

export class UserPage extends Component<{ match: { params: { username: string } } }> {
  list: { id: number; name: string }[] = [];
  render() {
    return (
      <>
        {loggedIn && this.props.match.params.username != 'newrecipe' ? (
          <Card title={'Welcome to MatMania, ' + this.props.match.params.username}>
            <Column>
              <Card title="">
                <Row>
                  <h3>Username: {siteUsername}</h3>
                </Row>

                <Button.Danger
                  onClick={() => {
                    Set_login_status(false);
                    Set_siteUsername('');
                    Set_siteUserId(0);
                    Set_userLikedMeals([]);
                    history.push('/');
                  }}
                >
                  Log out
                </Button.Danger>
              </Card>
              <Card title={'Liked recipes'}>
                <Row>
                  {this.list.length != 0 ? (
                    this.list.map((element) => (
                      <Row key={element.id}>
                        <NavBar.Link to={`/recipes/${element.id}`}>
                          <div style={{ color: 'black' }}>Recipe: {element.name}</div>
                        </NavBar.Link>
                      </Row>
                    ))
                  ) : (
                    <h2>
                      <i>No liked recipes were found.. </i>
                    </h2>
                  )}
                </Row>
              </Card>
            </Column>
          </Card>
        ) : (
          ''
        )}
      </>
    );
  }

  mounted(): void {
    for (let i = 0; i < userLikedMeals.length; i++) {
      let a = allMeals.find((meal) => meal.id == userLikedMeals[i]);
      a != undefined ? this.list.push({ id: a.id, name: a.name }) : '';
    }
  }
}

export class RegisterPage extends Component {
  username: string = '';
  password: string = '';
  confirmpassword: string = '';
  admin: boolean = false;

  render() {
    return (
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
            <Form.Input
              value={this.username}
              type="string"
              onChange={(event) => (this.username = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Row>
          <Column width={2}>Password:</Column>
          <Column>
            <Form.Input
              value={this.password}
              type="password"
              onChange={(event) => (this.password = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Row>
          <Column width={2}>Confirm Password:</Column>
          <Column>
            <Form.Input
              value={this.confirmpassword}
              type="password"
              onChange={(event) => (this.confirmpassword = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <br />
        <Button.Success
          onClick={() => {
            if (!this.username || this.username == null)
              return Alert.danger('Please type in a username and try again');
            if (!this.password || this.password == null)
              return Alert.danger('Please provide a password and try again');
            if (this.password != this.confirmpassword) {
              return Alert.danger('Passwords not equivalent, try again');
            } else {
              let alerttext: string;

              mealService
                .createUser(this.username, this.password, this.admin)
                .then((response: any) => {
                  Set_login_status(true);
                  Set_siteUsername(this.username);
                  Set_siteUserId(response.userId);

                  alerttext = 'User: ' + this.username + ', created, Welcome to MatMania';
                  Alert.info(alerttext);

                  mealService.getUserLikes(siteUserId).then((meals) => {
                    Set_userLikedMeals(meals);
                  });
                  history.push('/');
                })
                .catch((error) => {
                  Alert.danger(error.data);
                });
            }
          }}
        >
          Create Account
        </Button.Success>
      </Card>
    );
  }
}
function findName(id: number): React.ReactNode {
  throw new Error('Function not implemented.');
}
