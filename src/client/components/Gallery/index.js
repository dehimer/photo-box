import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './index.css';

class Gallery extends Component {
  componentDidMount() {
  }

  render() {
    const { config, photos, match } = this.props;

    const fromPhotoId = match.params.from;
    console.log('fromPhotoId');
    console.log(fromPhotoId);

    // const fromPhoto = photos.find(photo => photo.id === fromPhotoId);
    const scrollToRef = React.createRef();

    return (
      <Fragment>
        <div className="gallery">
          {
            config.sources && config.sources.map(({ label }) => (
              <div key={label} className="panel">
                {
                  photos.map(photo => (
                    <Link key={photo.id} className="photo" to={`/view/${photo.id}`}>
                      <div className="label">{photo.id}</div>
                      <img alt={photo.name} src={`/images/${photo.thumb}`} />
                    </Link>
                  ))
                }
              </div>
            ))
          }
        </div>
        <div className="footer">
          <div className="print" />
          <div className="intro">请选择下载的照片</div>
        </div>
      </Fragment>
    );
  }
}

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
