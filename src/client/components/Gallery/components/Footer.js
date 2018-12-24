import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faEnvelopeSquare } from '@fortawesome/free-solid-svg-icons';
import EmailDialog from './EmailDialog';
import GradientButton from './GradientButton';


class Footer extends Component {
  state = {
    emailDialogOpen: false
  };

  openEmailDialog = () => {
    this.setState({
      emailDialogOpen: true,
    });
  };

  closeEmailDialog = (email) => {
    console.log('closeEmailDialog');
    console.log(email);
    if (email) {
      const { onSend } = this.props;
      onSend(email);
    }

    this.setState({
      emailDialogOpen: false,
    });
  };


  render() {
    const { mode, active, onPrint } = this.props;
    const { emailDialogOpen } = this.state;

    const content = (mode === 'print')
      ? (
        emailDialogOpen
          ? (<EmailDialog handleClose={this.closeEmailDialog} />)
          : (
            <div>
              <GradientButton
                variant="contained"
                color="primary"
                disabled={!active}
                onClick={onPrint}
              >
                <FontAwesomeIcon icon={faPrint} />
                Print
              </GradientButton>

              <GradientButton
                variant="contained"
                color="primary"
                disabled={!active}
                onClick={this.openEmailDialog}
              >
                <FontAwesomeIcon icon={faEnvelopeSquare} />
                Mail
              </GradientButton>
            </div>
          )
      )
      : (<div className="intro">请选择下载的照片</div>);

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
  onPrint: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  onSend: PropTypes.func.isRequired
};

export default Footer;
