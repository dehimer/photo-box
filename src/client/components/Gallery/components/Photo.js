import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Photo extends React.Component {
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
    const { photo } = this.props;

    return (
      <Link innerRef={this.ref} className="photo" to={`/view/${photo.id}`}>
        <div className="label">{photo.id}</div>
        <img alt={photo.name} src={`/images/${photo.thumb}`} />
      </Link>
    );
  }
}

Photo.propTypes = {
  inFocus: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  photo: PropTypes.object.isRequired,
};

export default Photo;
