import React from 'react';
import PropTypes from 'prop-types';

const Viewer = ({ photo }) => (
  <div>
    {
      photo.id
    }
  </div>
);

Viewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  photo: PropTypes.object.isRequired,
};

export default Viewer;
