import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faEnvelopeSquare } from '@fortawesome/free-solid-svg-icons';
import EmailDialog from './EmailDialog';

const PrintButton = styled(Button)({
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

class Footer extends Component {
  state = {
    emailDialogOpen: false
  };

  openEmailDialog = () => {
    this.setState({
      emailDialogOpen: true,
    });
  };

  closeEmailDialog = () => {
    this.setState({
      emailDialogOpen: false,
    });
  };


  render() {
    const { mode, active, onPrint } = this.props;
    const { emailDialogOpen } = this.state;

    let content = null;

    if (mode !== '') {
      content = (mode === 'print')
        ? (
          emailDialogOpen
            ? (<EmailDialog handleClose={this.closeEmailDialog} />)
            : (
              <div>
                <PrintButton
                  variant="contained"
                  color="primary"
                  disabled={!active}
                  onClick={onPrint}
                >
                  <FontAwesomeIcon icon={faPrint} />
                  Print
                </PrintButton>

                <PrintButton
                  variant="contained"
                  color="primary"
                  disabled={!active}
                  onClick={this.openEmailDialog}
                >
                  <FontAwesomeIcon icon={faEnvelopeSquare} />
                  Mail
                </PrintButton>
              </div>
            )
        )
        : (<div className="intro">请选择下载的照片</div>);
    }

    return (
      <div className="footer">
        { content }
      </div>
    );
  }
}


Footer.defaultProps = {
  mode: '',
};

Footer.propTypes = {
  active: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  mode: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  onPrint: PropTypes.func.isRequired
};

export default Footer;
