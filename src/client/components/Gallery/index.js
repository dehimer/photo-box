import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './index.css';

const Gallery = ({ config, photos }) => (
  <div className="gallery">
    {
      config.sources && config.sources.map(({ label }) => (
        <div key={label} className="panel">
          {
            photos.map(photo => (
              <Link key={photo.id} to={`/view/${photo.id}`}>
                <img alt={photo.name} src={`images/${photo.thumb}`} />
                {photo.id}
              </Link>
            ))
          }
        </div>
      ))
    }
  </div>
);

Gallery.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  config: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  photos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  const { config, photos } = state.server;

  return {
    config,
    photos
  };
};

const mapDispatchToProps = (/* dispatch */) => (
  {
    // addScores: (player) => {
    //   dispatch({ type: 'server/add_scores', data: player });
    // },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
