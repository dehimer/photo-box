import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.ensureScroll();
  }

  componentDidUpdate() {
    this.ensureScroll();
  }

  ensureScroll() {
    const { inFocus } = this.props;

    if (inFocus) {
      const { top, height } = this.ref.current.getBoundingClientRect();
      this.ref.current.parentElement.scrollTo(0, top - height / 2);
    }
  }

  render() {
    const { photo, onSelect, shadowed } = this.props;

    return (
      <div
        className={`photo ${shadowed ? 'shadowed' : ''}`}
        ref={this.ref}
        onClick={() => onSelect(photo)}
      >
        <div className="label">{photo.id}</div>
        <img alt={photo.name} src={`/images/${photo.thumb}`} />
      </div>
    );
  }
}

Index.propTypes = {
  shadowed: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  inFocus: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  photo: PropTypes.object.isRequired,
};

export default Index;