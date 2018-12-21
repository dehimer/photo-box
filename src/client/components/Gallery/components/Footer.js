import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const Footer = ({ mode }) => {
  let content = null;

  if (mode !== '') {
    content = (mode === 'print')
      ? (
        <div>
          <Button variant="contained" color="primary">Print</Button>
          <Button variant="contained" color="primary">Mail</Button>
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
  // eslint-disable-next-line react/forbid-prop-types
  mode: PropTypes.string
};

export default Footer;
