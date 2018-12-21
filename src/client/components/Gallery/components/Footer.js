import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ mode }) => {
  let content = null;

  if (typeof mode !== '') {
    content = (mode === 'print')
      ? (
        <div>
          <button type="button">Print</button>
          <button type="button">Mail</button>
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
