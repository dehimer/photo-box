import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

import Photo from './components/Photo';
import Footer from './components/Footer';

const Gallery = ({ config, photos, match, history }) => {
  const fromPhotoId = match.params.from;
  const { sources, mode } = config;

  const onSelect = (photo) => {
    if (mode === 'print') {
      // run print code
    } else {
      history.push(`/view/${photo.id}`);
    }
  };

  return (
    <Fragment>
      <div className="gallery">
        {
          sources && sources.map(({ label }) => (
            <div key={label} className="panel">
              {
                photos.map(photo => (
                  <Photo
                    key={photo.id}
                    photo={photo}
                    inFocus={photo.id === fromPhotoId}
                    selected={onSelect}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
      <Footer mode={mode} active={false} />
    </Fragment>
  );
};

Gallery.defaultProps = {
  match: {
    params: {
      from: null
    }
  }
};

Gallery.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object,
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
)(withRouter(Gallery));
