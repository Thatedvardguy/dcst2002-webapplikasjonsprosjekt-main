import * as React from 'react';
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
  NavBar,
} from '../src/widgets';

import { NavLink } from 'react-router-dom';

describe('Form tests', () => {
  test('Form.Label draws correctly', (done) => {
    const wrapper = shallow(<Form.Label />);

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([<label className="col-form-label" />])).toEqual(
        true
      );
      done();
    });
  });
  test('Form.Input draws correctly', (done) => {
    const wrapper = shallow(<Form.Input type="text" value="" onChange={() => {}} />);

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([<input className="form-control" />])).toEqual(
        true
      );
      done();
    });
  });
  test('Form.Textarea draws correctly', (done) => {
    const wrapper = shallow(<Form.Textarea type="text" value="" onChange={() => {}} />);

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([<textarea className="form-control" />])).toEqual(
        true
      );
      done();
    });
  });
  test('Form.Checkbox draws correctly', (done) => {
    const wrapper = shallow(<Form.Checkbox checked={false} value="" onChange={() => {}} />);

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([<input className="form-check-input" />])).toEqual(
        true
      );
      done();
    });
  });
  test('Form.Select draws correctly', (done) => {
    const wrapper = shallow(<Form.Select value="" onChange={() => {}} />);

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([<select className="custom-select" />])).toEqual(
        true
      );
      done();
    });
  });
});

describe('Navbar tests', () => {
  test('NavBar draws correctly', (done) => {
    const wrapper = shallow(<NavBar brand="" />);
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <nav className="navbar navbar-expand-sm navbar-light bg-success">
            <div className="container-fluid justify-content-start">
              <NavLink className="navbar-brand" activeClassName="active" exact to="/">
                {''}
              </NavLink>
              <div className="navbar-nav text-light"></div>
            </div>
          </nav>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('NavBar.Link draws correctly', (done) => {
    const wrapper = shallow(<NavBar.Link to="/test" />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink
            className="nav-link text-white"
            activeClassName="active text-blue"
            to="/test"
          ></NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('NavBarx.Link draws correctly', (done) => {
    const wrapper = shallow(<NavBarx.Link to="/test" />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink className="nav-link" activeClassName="active text-black" exact={true} to="/test">
            <button className="btn btn-outline-light" type="button"></button>
          </NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('NavBarx draws correctly', (done) => {
    const wrapper = shallow(<NavBarx brand="" />);
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <nav className="navbar navbar-expand-md navbar-light bg-dark">
            <NavLink className="navbar-brand text-white" activeClassName="active" exact to="/">
              {''}
            </NavLink>
            <button
              className="navbar-toggler bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <div className="navbar-nav" />
              </ul>
            </div>
          </nav>,
        ])
      ).toEqual(true);
      done();
    });
  });
});

describe('Scrollbar tests', () => {
  test('Scrollbar draws correctly', (done) => {
    const wrapper = shallow(<Scrollbar width={2} height={2} />);
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Card title="">
            <div style={{ width: 2 + 'px', height: 2 + 'px' }} className="overflow-auto"></div>
          </Card>,
        ])
      ).toEqual(true);
      done();
    });
  });
});

describe('DropDown tests', () => {
  test('DropDownMenu draws correctly', (done) => {
    const wrapper = shallow(<DropDownMenu width={2} title="test" />);
    wrapper.find('button').simulate('click');
    wrapper.find('button').simulate('click');

    setTimeout(() => {
      console.log(wrapper.debug());
      expect(
        wrapper.containsAllMatchingElements([
          <div>
            <button style={{ width: 2 + 'px' }} className="btn btn-outline-dark" type="button">
              {'test'}
            </button>
            <ul style={{ display: 'none' }} />
          </div>,
        ])
      ).toEqual(true);

      done();
    });
  });

  test('DropDownMenu.Element draws correctly', (done) => {
    const wrapper = shallow(
      <DropDownMenu.Element id={1} value="test">
        Element
      </DropDownMenu.Element>
    );
    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([<li>{['Element']}</li>])).toEqual(true);
      done();
    });
  });

  test('DropDownMenu draws correctly (w/ display)', (done) => {
    const wrapper = shallow(<DropDownMenu width={2} title="test"></DropDownMenu>);
    wrapper.find('button').simulate('click');
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <div>
            <button style={{ width: 2 + 'px' }} className="btn bg-success text-white" type="button">
              {'test'}
            </button>
            <ul style={{ display: 'block' }} />
          </div>,
        ])
      ).toEqual(true);
      done();
    });
  });
});

describe('Alert tests', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Close alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').simulate('click');

      expect(wrapper.matchesElement(<div></div>)).toEqual(true);

      done();
    });
  });

  test('Open 4 alert messages, and close the second alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.success('test1');
    Alert.info('test2');
    Alert.warning('test3');
    Alert.danger('test4');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test1
              <button />
            </div>
            <div>
              test2
              <button />
            </div>
            <div>
              test3
              <button />
            </div>
            <div>
              test4
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').at(1).simulate('click');

      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test1
              <button />
            </div>
            <div>
              test3
              <button />
            </div>
            <div>
              test4
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });
});

describe('Card tests', () => {
  test('Card test', (done) => {
    const wrapper = shallow(<Card title="Card title"></Card>);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">{'Card title'}</h1>
              <div className="card-text"></div>
            </div>
          </div>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('CardFrontPage test', (done) => {
    const wrapper = shallow(<CardFrontPage title="Card title"></CardFrontPage>);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <div className="card">
            <div className="card-body">
              <h1 className="card-header bg-success text-white">{'Card title'}</h1>
              <div className="card-text"></div>
            </div>
          </div>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('Row test', (done) => {
    const wrapper = shallow(<Row>Some text</Row>);

    setTimeout(() => {
      expect(wrapper.containsMatchingElement(<div className="row">Some text</div>)).toEqual(true);
    });
    done();
  });

  test('Column test 1', (done) => {
    const wrapper = shallow(<Column width={2}>Some text</Column>);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <div className="col 2">
            <div>Some text</div>
          </div>,
        ])
      ).toEqual(true);
    });
    done();
  });

  test('Column test 2', (done) => {
    const wrapper = shallow(
      <Column width={6} right={true}>
        Some text
      </Column>
    );

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <div className="col 6">
            <div className="float-end">Some text</div>
          </div>,
        ])
      ).toEqual(true);
    });
    done();
  });
});

describe('Button tests', () => {
  test('Success button test', (done) => {
    const wrapper = shallow(<Button.Success onClick={() => {}}>Click me!</Button.Success>);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(<button className="btn btn-success">Click me!</button>)
      ).toEqual(true);
    });
    done();
  });

  test('Danger button test', (done) => {
    const wrapper = shallow(<Button.Danger onClick={() => {}}>Click me!</Button.Danger>);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(<button className="btn btn-danger">Click me!</button>)
      ).toEqual(true);
    });
    done();
  });

  test('Light button test', (done) => {
    const wrapper = shallow(<Button.Light onClick={() => {}}>Click me!</Button.Light>);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(<button className="btn btn-light">Click me!</button>)
      ).toEqual(true);
    });
    done();
  });

  test('Dark button test', (done) => {
    const wrapper = shallow(<Button.Dark onClick={() => {}}>Click me!</Button.Dark>);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(<button className="btn btn-outline-dark">Click me!</button>)
      ).toEqual(true);
    });
    done();
  });

  test('Rounded button test', (done) => {
    const wrapper = shallow(<Button.Rounded onClick={() => {}}>Click me!</Button.Rounded>);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          <button className="btn btn-success btn-circle">Click me!</button>
        )
      ).toEqual(true);
    });
    done();
  });

  test('Rounded (red) button test', (done) => {
    const wrapper = shallow(
      <Button.Rounded red onClick={() => {}}>
        Click me!
      </Button.Rounded>
    );

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          <button className="btn btn-danger btn-circle">Click me!</button>
        )
      ).toEqual(true);
    });
    done();
  });

  test('Small Danger button test', (done) => {
    const wrapper = shallow(
      <Button.Danger small onClick={() => {}}>
        Click me!
      </Button.Danger>
    );

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(<button className="btn btn-danger">Click me!</button>)
      ).toEqual(false);

      expect(
        wrapper.containsMatchingElement(
          <button
            className="btn btn-danger"
            style={{
              padding: '5px 5px',
              fontSize: '16px',
              lineHeight: '0.7',
            }}
          >
            Click me!
          </button>
        )
      ).toEqual(true);
    });
    done();
  });

  test('Button Click tests', (done) => {
    let buttonCliked = false;
    const wrapper = shallow(
      <Button.Light onClick={() => (buttonCliked = true)}>Click me!</Button.Light>
    );

    setTimeout(() => {
      expect(buttonCliked).toEqual(false);

      wrapper.find('button').simulate('click');

      expect(buttonCliked).toEqual(true);
    });
    done();
  });
});
