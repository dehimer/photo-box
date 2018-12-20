import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import connect from 'react-redux/es/connect/connect';

import './index.css';

const Viewer = ({ match, photos }) => {
  const photoId = match.params.id;
  const photo = photos.find(ph => ph.id === photoId);
  const idx = photos.map(ph => ph.id).indexOf(photo.id);

  const prevPhoto = photos[idx - 1] ? photos[idx - 1] : photo;
  const nextPhoto = photos[idx + 1] ? photos[idx + 1] : photo;

  return (
    <div className="viewer">
      <div className="id">{photo.id}</div>

      <div className="photos-block">
        <Link className="switcher prev" to={`/view/${prevPhoto.id}`}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </Link>

        <div className="photo">
          <img alt={photo.name} src={`/images/${photo.src}`} />
        </div>

        <Link className="switcher next" to={`/view/${nextPhoto.id}`}>
          <FontAwesomeIcon icon={faAngleRight} />
        </Link>
      </div>

      <div className="qr-block">
        <div className="note">扫描二维码下载照片</div>
        <div className="qr">
          <canvas/>
        </div>
      </div>

      <Link to="/">返回</Link>
    </div>
  );
};

Viewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  photos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  const { photos } = state.server;

  return {
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
)(Viewer);
