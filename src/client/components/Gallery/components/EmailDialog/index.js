import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import './index.css';
import { styled } from '@material-ui/styles';

const StyledButton = styled(Button)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 100,
  width: 300,
  fontSize: 40,
  margin: '0 20px'
});

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
        <input type="email" id="email" placeholder="Please, enter email" value={email} onChange={e => this.handleEmail(e.target.value)} />
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleClose}
        >
          Close
        </StyledButton>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => handleClose(email)}
          disabled={!emailValid}
        >
          Send
        </StyledButton>
      </div>
    );
  }
}


EmailDialog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  handleClose: PropTypes.func.isRequired
};

export default EmailDialog;
