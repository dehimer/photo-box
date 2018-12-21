import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

import Photo from '../Photo';

const Gallery = ({ config: { sources, mode }, photos, match }) => {
  const fromPhotoId = match.params.from;

  return (
    <Fragment>
      <div className="gallery">
        {
          sources && sources.map(({ label }) => (
            <div key={label} className="panel">
              {
                photos.map(photo => (
                  <Photo key={photo.id} photo={photo} inFocus={photo.id === fromPhotoId} />
                ))
              }
            </div>
          ))
        }
      </div>
      <div className="footer">
        {
          mode === 'print'
            ? (<div className="print" />)
            : (<div className="intro">请选择下载的照片</div>)
        }
      </div>
    </Fragment>
  );
};

Gallery.defaultProps = {
  match: { params: { from: null } }
};

Gallery.propTypes = {
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
)(Gallery);
