import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import connect from 'react-redux/es/connect/connect';
import { QRCode } from 'react-qr-svg';

import './index.css';

class Viewer extends PureComponent {
  closeTimer = null;

  componentDidMount() {
    this.setCloseTimer();
  }

  componentDidUpdate() {
    this.setCloseTimer();
  }

  componentWillUnmount() {
    this.unsetCloseTimer();
  }

  setCloseTimer() {
    const { config: { viewerCloseAfter }, history, match } = this.props;

    const photoId = match.params.id;

    clearTimeout(this.closeTimer);

    this.closeTimer = setTimeout(() => {
      history.push(`/${photoId}`);
    }, viewerCloseAfter * 1000);
  }

  unsetCloseTimer() {
    clearTimeout(this.closeTimer);

    this.closeTimer = null;
  }

  switchPhoto(photo) {
    const { history } = this.props;
    history.push(`/view/${photo.id}`);
  }

  render() {
    const { match, photos } = this.props;

    const photoId = match.params.id;
    const photo = photos.find(ph => ph.id === photoId);

    if (!photo) return null;

    const idx = photos.map(ph => ph.id).indexOf(photo.id);

    const prevPhoto = photos[idx - 1] ? photos[idx - 1] : photo;
    const nextPhoto = photos[idx + 1] ? photos[idx + 1] : photo;

    return (
      <div className="viewer">
        <div className="id">{photo.id}</div>

        <div className="photos-block">
          <div
            className={`switcher prev ${(prevPhoto.id === photo.id) ? 'disabled' : ''}`}
            onClick={() => this.switchPhoto(prevPhoto)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>

          <div className="photo">
            <img alt={photo.name} src={`/images/${photo.src}`} />
          </div>

          <div
            className={`switcher next ${(nextPhoto.id === photo.id) ? 'disabled' : ''}`}
            onClick={() => this.switchPhoto(nextPhoto)}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </div>

        <div className="qr-block">
          <div className="note">扫描二维码下载照片</div>
          <div className="qr">
            <QRCode
              bgColor="white"
              fgColor="black"
              level="Q"
              style={{ width: 256 }}
              value={photo.uploadedUrl}
            />
          </div>
        </div>

        <Link className="close" to={`/${photo.id}`}>返回</Link>
      </div>
    );
  }
}

Viewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  config: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  photos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  const { photos, config } = state.server;

  return {
    photos,
    config
  };
};
export default connect(
  mapStateToProps,
)(withRouter(Viewer));
