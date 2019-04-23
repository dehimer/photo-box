import React, { Component } from 'react';

// import _ from 'underscore';

import './index.css';
import Photo from '../Photo';
import PropTypes from 'prop-types';


class Panel extends Component {
  state = {
    disableAutoScrollTop: false,
  };

  constructor(props) {
    super(props);

    this.panelRef = React.createRef();
    // this.scrollDetect = _.throttle(this.scrollDetect, 100);
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   if (nextState.disableAutoScrollTop !== this.state.disableAutoScrollTop) return false;
  //   return true;
  // }
  componentWillUnmount() {
    if (this.userScrollTimeout) {
      clearTimeout(this.userScrollTimeout);
      this.userScrollTimeout = null;
    }

    if (this.noActivityAutoscrollTimeout) {
      clearTimeout(this.noActivityAutoscrollTimeout);
      this.noActivityAutoscrollTimeout = null;
    }
  }

  scrollTop = () => {
    const {
      scrollToTopOnNewPhoto,
      selected,
    } = this.props;

    const {
      disableAutoScrollTop
    } = this.state;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }

    if (scrollToTopOnNewPhoto && !selected && !disableAutoScrollTop) {
      this.scrollTimeout = setTimeout(() => {
        this.panelRef.current.scroll({
          top: 0,
          left: 0,
          // behavior: 'smooth'
        });
      }, 150);
    }
  };

  scrollDetect = () => {
    this.updateAutoScrollDisable();
    this.updateNoActivityTopScroll();
  };

  updateNoActivityTopScroll() {
    const { noActivityAutoScrollIn } = this.props;

    if (this.noActivityAutoscrollTimeout) {
      clearTimeout(this.noActivityAutoscrollTimeout);
      this.noActivityAutoscrollTimeout = null;
    }

    this.noActivityAutoscrollTimeout = setTimeout(() => {
      clearTimeout(this.noActivityAutoscrollTimeout);
      this.noActivityAutoscrollTimeout = null;

      this.panelRef.current.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, noActivityAutoScrollIn);
  }

  updateAutoScrollDisable() {
    const { disableAutoScrollTop } = this.state;
    const { ignoreAutoscrollAfterManualScrollIn } = this.props;

    console.log(`scrollDetect: ${ignoreAutoscrollAfterManualScrollIn} ${disableAutoScrollTop}`);
    if (this.userScrollTimeout) {
      clearTimeout(this.userScrollTimeout);
      this.userScrollTimeout = null;
    }

    if (!disableAutoScrollTop) {
      this.setState({
        disableAutoScrollTop: true
      });
    }

    this.userScrollTimeout = setTimeout(() => {
      if (this.userScrollTimeout) {
        clearTimeout(this.userScrollTimeout);
        this.userScrollTimeout = null;
      }

      this.setState({
        disableAutoScrollTop: false
      });
    }, ignoreAutoscrollAfterManualScrollIn);
  }

  render() {
    const {
      photos,
      fromPhotoId,
      columns,
      onSelect,
      totalColumns,
      mode,
      selected
    } = this.props;

    return (
      <div className="panel" ref={this.panelRef} onScroll={this.scrollDetect}>
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
                columns={columns}
                totalColumns={totalColumns}
                inFocus={inFocus}
                onLoad={this.scrollTop}
                onSelect={onSelect}
                shadowed={shadowed}
              />
            );
          })
        }
      </div>
    );
  }
}

Panel.propTypes = {
  photos: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  fromPhotoId: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  columns: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  totalColumns: PropTypes.number.isRequired,
  ignoreAutoscrollAfterManualScrollIn: PropTypes.number.isRequired,
  noActivityAutoScrollIn: PropTypes.number.isRequired,
  scrollToTopOnNewPhoto: PropTypes.bool.isRequired
};

export default Panel;
