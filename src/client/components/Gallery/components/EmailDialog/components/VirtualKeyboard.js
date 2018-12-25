import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Keyboard from 'react-screen-keyboard';

export default class VirtualKeyboard extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    value: '',
    onFocus: null,
  };

  state = {
    inputNode: null,
  };

  handleInput = event => this.props.onChange(event.target.value);

  handleFocus = () => {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(this.input);
      this.setState({
        inputNode: this.input
      });
      // the `this.refs.input` value should be passed to the Keyboard component as inputNode prop
    }
  };

  render() {
    const { value, children } = this.props;
    const { inputNode } = this.state;

    return (
      <div>
        { children }
        <input
          onInput={this.handleInput}
          value={value}
          onFocus={this.handleFocus}
          ref={(input) => { this.input = input; }}
        />
        <Keyboard
          inputNode={inputNode}
        />
      </div>
    );
  }
}
