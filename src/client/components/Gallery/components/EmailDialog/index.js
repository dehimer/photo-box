import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import GradientButton from '../GradientButton';

import './index.css';


class EmailDialog extends Component {
  state = {
    email: '',
    emailValid: false,
    layoutName: 'default',
  };

  closeTimer = null;

  componentDidMount() {
    this.setCloseTimer();
  }

  componentDidUpdate() {
    this.setCloseTimer();
  }

  componentWillUnmount() {
    this.unsetCloseTimer();
  }

  onChangeInput = (event) => {
    const email = event.target.value;

    if (this.keyboard) this.keyboard.setInput(email);
    this.handleEmail(email);
  };

  onKeyPress = (button) => {
    if (button === '{shift}' || button === '{lock}') this.handleShift();
  };

  setCloseTimer() {
    const { handleClose, config: { emailFormCloseAfter } } = this.props;
    clearTimeout(this.closeTimer);

    if (emailFormCloseAfter) {
      this.closeTimer = setTimeout(() => {
        handleClose();
      }, emailFormCloseAfter * 1000);
    }
  }

  handleShift = () => {
    const { layoutName } = this.state;

    this.setState({
      layoutName: layoutName === 'default' ? 'shift' : 'default'
    });
  };

  unsetCloseTimer() {
    clearTimeout(this.closeTimer);

    this.closeTimer = null;
  }

  handleEmail(email) {
    this.setCloseTimer();
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.setState({
      email,
      emailValid: re.test(String(email).toLowerCase()),
    });
  }

  render() {
    const { handleClose } = this.props;
    const { email, emailValid, layoutName } = this.state;

    return (
      <div className="email-dialog">
        <Keyboard
          ref={(kb) => { this.keyboard = kb; }}
          layoutName={layoutName}
          onChange={input => this.handleEmail(input)}
          onKeyPress={button => this.onKeyPress(button)}
        />

        <div className="controls">
          <input
            type="email"
            id="email"
            placeholder="Please, enter email"
            value={email}
            onChange={e => this.onChangeInput(e)}
            ref={this.inputRef}
          />

          <GradientButton
            variant="contained"
            color="primary"
            onClick={() => handleClose()}
          >
            Close
          </GradientButton>
          <GradientButton
            variant="contained"
            color="primary"
            onClick={() => handleClose(email)}
            disabled={!emailValid}
          >
            Send
          </GradientButton>
        </div>
      </div>
    );
  }
}


EmailDialog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  config: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { config } = state.server;
  return { config };
};


export default connect(
  mapStateToProps,
)(withRouter(EmailDialog));
