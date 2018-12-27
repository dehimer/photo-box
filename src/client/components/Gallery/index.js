import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

import Photo from './components/Photo';
import Footer from './components/Footer';

class Gallery extends Component {
  state = {
    selected: null
  };

  onPrintSelected = () => {
    const { print } = this.props;
    const { selected } = this.state;

    print(selected);

    this.setState({
      selected: null
    });
  };

  onSendSelected = (email) => {
    const { send } = this.props;
    const { selected } = this.state;

    if (email) {
      send({
        email,
        photo: selected
      });
    }

    this.setState({
      selected: null
    });
  };

  onSelect = (photo) => {
    const { selected } = this.state;
    const { config, history } = this.props;
    const { mode } = config;

    if (mode === 'print') {
      this.setState({
        selected: selected ? null : photo
      });
    } else {
      history.push(`/view/${photo.id}`);
    }
  };

  render() {
    const { selected } = this.state;
    const { config, photos, match } = this.props;
    const fromPhotoId = match.params.from;
    const { sources, mode } = config;

    return (
      <Fragment>
        <div className="gallery">
          {
            sources && sources.map(({ label }) => (
              <div key={label} className="panel">
                {
                  photos.map((photo) => {
                    let inFocus;
                    let shadowed;

                    if (mode === 'print') {
                      inFocus = false;
                      shadowed = selected ? selected.id !== photo.id : false;
                    } else {
                      inFocus = (photo.id === fromPhotoId);
                      shadowed = false;
                    }

                    return (
                      <Photo
                        key={photo._id}
                        photo={photo}
                        inFocus={inFocus}
                        onSelect={this.onSelect}
                        shadowed={shadowed}
                      />
                    );
                  })
                }
              </div>
            ))
          }
        </div>
        <Footer
          mode={mode}
          active={!!selected}
          onPrint={this.onPrintSelected}
          onSend={this.onSendSelected}
        />
      </Fragment>
    );
  }
}

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
  print: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { config, photos } = state.server;

  return {
    config,
    photos
  };
};

const mapDispatchToProps = dispatch => (
  {
    print: (photo) => {
      dispatch({
        type: 'server/print',
        data: photo
      });
    },
    send: (data) => {
      dispatch({
        type: 'server/send',
        data
      });
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Gallery));
