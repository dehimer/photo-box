import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GradientButton from '../GradientButton';

import './index.css';

class EmailDialog extends Component {
  state = {
    email: '',
    emailValid: false
  };

  handleEmail(email) {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.setState({
      email,
      emailValid: re.test(String(email).toLowerCase()),
    });
  }

  render() {
    const { handleClose } = this.props;
    const { email, emailValid } = this.state;

    return (
      <div className="email-dialog">
        <input
          type="email" id="email" placeholder="Please, enter email"
          value={email} onChange={e => this.handleEmail(e.target.value)}
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
    );
  }
}


EmailDialog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  handleClose: PropTypes.func.isRequired
};

export default EmailDialog;
