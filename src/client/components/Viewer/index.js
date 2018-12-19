import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Viewer = ({ match }) => (
  <div>
    {
      match.params.id
    }
    <Link to="/">返回</Link>
  </div>
);

Viewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
};

export default Viewer;
