import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

import Photo from './components/Photo';
import Panel from './components/Panel';
import Footer from './components/Footer';

class Gallery extends Component {
  state = {
    selected: null
  };

  constructor(props) {
    super(props);
  }

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
    const {
      scrollToTopOnNewPhoto = false,
      ignoreAutoscrollAfterManualScrollIn = 10000,
    } = config;
    const fromPhotoId = match.params.from;
    const { sources, mode } = config;

    const totalColumns = sources
      ? sources.map(({ columns }) => columns).reduce((res, columns) => res + columns, 0)
      : 0;

    return (
      <Fragment>
        <div className="gallery">
          {
            sources && sources.map(({ label, columns }) => {
              const photosOfSource = photos.filter(photo => photo.label === label);

              return <Panel
                key={label}
                photos={photosOfSource}
                columns={columns}
                totalColumns={totalColumns}
                fromPhotoId={fromPhotoId}
                onSelect={this.onSelect}
                mode={mode}
                selected={selected}
                scrollToTopOnNewPhoto={scrollToTopOnNewPhoto}
                ignoreAutoscrollAfterManualScrollIn={ignoreAutoscrollAfterManualScrollIn}
              />;
            })
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
