import * as React from 'react';
import { ReactNode, ChangeEvent } from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

/**
 * Renders an information card using Bootstrap classes.
 *
 * Properties: title
 */
export class Card extends Component<{ title: ReactNode }> {
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">{this.props.title}</h1>
          <div className="card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
export class CardFrontPage extends Component<{ title: ReactNode }> {
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h1 className="card-header bg-success text-white">{this.props.title}</h1>
          <div className="card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

/**
 * Renders a row using Bootstrap classes.
 */
export class Row extends Component {
  render() {
    return <div className="row">{this.props.children}</div>;
  }
}

export class Scrollbar extends Component<{ width: number; height: number }> {
  render() {
    return (
      <Card title="">
        <div
          style={{ width: this.props.width + 'px', height: this.props.height + 'px' }}
          className="overflow-auto"
        >
          {this.props.children}
        </div>
      </Card>
    );
  }
}

class DropDownMenuElement extends Component<{ id: number; value: string }> {
  render() {
    return <li>{[this.props.children, '  ']}</li>;
  }
}
export class DropDownMenu extends Component<{ title: ReactNode; width: number }> {
  style = {
    display: 'none',
  };
  className = 'btn btn-outline-dark';
  static Element = DropDownMenuElement;

  render() {
    return (
      <div>
        <button
          style={{ width: this.props.width + 'px' }}
          className={this.className}
          type="button"
          onClick={() => {
            if (this.style.display == 'block') {
              this.style = { display: 'none' };
              this.className = 'btn btn-outline-dark';
            } else {
              this.style = { display: 'block' };
              this.className = 'btn bg-success text-white';
            }
          }}
        >
          {this.props.title}
        </button>
        <ul style={this.style}>{this.props.children}</ul>
      </div>
    );
  }
}

/**
 * Renders a column with specified width using Bootstrap classes.
 *
 * Properties: width, right
 */
export class Column extends Component<{ width?: number; right?: boolean }> {
  render() {
    return (
      <div className={'col' + (this.props.width ? '-' + this.props.width : '')}>
        <div className={'float-' + (this.props.right ? 'end' : 'start')}>{this.props.children}</div>
      </div>
    );
  }
}

/**
 * Renders a success button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonSuccess extends Component<{
  small?: boolean;
  onClick: () => void;
}> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-success"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a danger button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonDanger extends Component<{
  small?: boolean;
  onClick: () => void;
}> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-danger"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a light button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonLight extends Component<{
  small?: boolean;
  onClick: () => void;
}> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-light"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}
class ButtonDark extends Component<{
  small?: boolean;
  onClick: () => void;
}> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-outline-dark"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

class ButtonRounded extends Component<{
  red?: boolean;
  onClick: () => void;
}> {
  render() {
    return (
      <button
        type="button"
        className={this.props.red ? 'btn btn-danger btn-circle' : 'btn btn-success btn-circle'}
        style={{
          width: '35px',
          height: '35px',
          borderRadius: '100px',
          fontSize: '15px',
          textAlign: 'center',
        }}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a button using Bootstrap styles.
 *
 * Properties: onClick
 */
export class Button {
  static Success = ButtonSuccess;
  static Danger = ButtonDanger;
  static Light = ButtonLight;
  static Dark = ButtonDark;
  static Rounded = ButtonRounded;
}

/**
 * Renders a NavBar link using Bootstrap styles.
 *
 * Properties: to
 */
class NavBarLink extends Component<{ to: string }> {
  render() {
    return (
      <NavLink
        className="nav-link text-white"
        activeClassName="active text-blue"
        to={this.props.to}
      >
        {this.props.children}
      </NavLink>
    );
  }
}

class NavBarLinkx extends Component<{ to: string }> {
  render() {
    return (
      <NavLink className="nav-link" activeClassName="active text-black" exact to={this.props.to}>
        <button className="btn btn-outline-light" type="button">
          {this.props.children}
        </button>
      </NavLink>
    );
  }
}

/**
 * Renders a NavBar using Bootstrap classes.
 *
 * Properties: brand
 */
export class NavBar extends Component<{ brand: ReactNode }> {
  static Link = NavBarLink;

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-success">
        <div className="container-fluid justify-content-start">
          <NavLink className="navbar-brand" activeClassName="active" exact to="/">
            {this.props.brand}
          </NavLink>
          <div className="navbar-nav text-light">{this.props.children}</div>
        </div>
      </nav>
    );
  }
}

export class NavBarx extends Component<{ brand: ReactNode }> {
  static Link = NavBarLinkx;

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-light bg-dark">
        <NavLink className="navbar-brand text-white" activeClassName="active" exact to="/">
          {this.props.brand}
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
            <div className="navbar-nav">{this.props.children}</div>
          </ul>
        </div>
      </nav>
    );
  }
}

/**
 * Renders a form label using Bootstrap styles.
 */
class FormLabel extends Component {
  render() {
    return <label className="col-form-label">{this.props.children}</label>;
  }
}

/**
 * Renders a form input using Bootstrap styles.
 */
class FormInput extends Component<{
  type: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, width, height, pattern
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { type, value, onChange, ...rest } = this.props;
    return (
      <input
        {...rest}
        className="form-control"
        type={this.props.type}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

/**
 * Renders a form textarea using Bootstrap styles.
 */
class FormTextarea extends React.Component<{
  rows?: number;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, rows, cols
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { value, onChange, rows, ...rest } = this.props;
    return (
      <textarea
        {...rest}
        rows={rows ? rows : undefined}
        className="form-control"
        value={value}
        onChange={onChange}
      />
    );
  }
}

/**
 * Renders a form checkbox using Bootstrap styles.
 */
class FormCheckbox extends Component<{
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, width, height, pattern
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { checked, onChange, ...rest } = this.props;
    return (
      <input
        {...rest}
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    );
  }
}

/**
 * Renders a form select using Bootstrap styles.
 */
class FormSelect extends Component<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, size.
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { value, onChange, children, ...rest } = this.props;
    return (
      <select {...rest} className="custom-select" value={value} onChange={onChange}>
        {children}
      </select>
    );
  }
}

/**
 * Renders form components using Bootstrap styles.
 */
export class Form {
  static Label = FormLabel;
  static Input = FormInput;
  static Textarea = FormTextarea;
  static Checkbox = FormCheckbox;
  static Select = FormSelect;
}

/**
 * Renders alert messages using Bootstrap classes.
 *
 * Students: this slightly more complex component is not part of curriculum.
 */
export class Alert extends Component {
  alerts: { id: number; text: ReactNode; type: string }[] = [];
  nextId: number = 0;

  render() {
    return (
      <div>
        {this.alerts.map((alert, i) => (
          <div
            key={alert.id}
            className={'alert fixed-top alert-dismissible alert-' + alert.type}
            role="alert"
          >
            {alert.text}
            <button
              type="button"
              className="btn-close btn-sm"
              onClick={() => this.alerts.splice(i, 1)}
            />
          </div>
        ))}
      </div>
    );
  }

  /**
   * Show success alert.
   */
  static success(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'success' });
    });
  }

  /**
   * Show info alert.
   */
  static info(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'info' });
    });
  }

  /**
   * Show warning alert.
   */
  static warning(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'warning' });
    });
  }

  /**
   * Show danger alert.
   */
  static danger(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'danger' });
    });
  }
}
