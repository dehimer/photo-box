import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

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

const Footer = ({ mode, active }) => {
  let content = null;

  if (mode !== '') {
    content = (mode === 'print')
      ? (
        <div>
          <PrintButton variant="contained" color="primary" disabled={!active}>Print</PrintButton>
          <PrintButton variant="contained" color="primary" disabled={!active}>Mail</PrintButton>
        </div>
      )
      : (<div className="intro">请选择下载的照片</div>);
  }

  return (
    <div className="footer">
      { content }
    </div>
  );
};

Footer.defaultProps = {
  mode: '',
};

Footer.propTypes = {
  active: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  mode: PropTypes.string
};

export default Footer;
