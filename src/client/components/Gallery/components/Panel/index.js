import React, { Component } from 'react';

import './index.css';

export default class Panel extends Component {
  constructor(props) {
    super(props);

    this.panelRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    this.scrollTimeout = setTimeout(() => {
      this.panelRef.current.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 500);
  }

  render() {
    return (
      <div className="panel" ref={this.panelRef}>
        { this.props.children }
      </div>
    );
  }
}
