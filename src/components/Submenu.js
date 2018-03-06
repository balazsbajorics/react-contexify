import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './styles';

export default class Submenu extends Component {
  static propTypes = {
    label: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    arrow: PropTypes.node,
    nativeEvent: PropTypes.object,
    dataFromProvider: PropTypes.any,
    refsFromProvider: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object)
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
  };

  static defaultProps = {
    arrow: '▶',
    nativeEvent: null,
    dataFromProvider: null,
    refsFromProvider: null,
    className: null,
    style: {},
    disabled: false
  };

  state = {
    style: {
      left: '100%',
      top:0,
      bottom: 'initial'
    }
  };

  setMenuRef = ref => {
    this.menu = ref;
  };

  setRef = ref => {
    this.ref = ref;
  };

  componentDidMount() {
    const { innerWidth, innerHeight } = window;
    const menuRect = this.menu.getBoundingClientRect();
    const itemRect = this.ref.getBoundingClientRect();
    const style = {};

    if(menuRect.right < innerWidth) {
      style.left = '100%';
    } else {
      style.right = '100%';
    }

    if ((itemRect.top + menuRect.height) > innerHeight) {
      style.bottom = 0;
      style.top = 'initial';
    } else {
      style.bottom = 'initial';
      style.top = itemRect.top - menuRect.top;
    }

    this.setState({
      style: style
    });
  }

  getMenuItem() {
    const { nativeEvent, refsFromProvider, dataFromProvider } = this.props;

    return React.Children.map(this.props.children, item =>
      React.cloneElement(item, {
        nativeEvent,
        refsFromProvider,
        dataFromProvider
      })
    );
  }

  handleClick(e) {
    e.stopPropagation();
  }

  render() {
    const {
      arrow,
      disabled,
      className,
      style,
      label,
      nativeEvent,
      refsFromProvider,
      dataFromProvider,
    } = this.props;
    const cssClasses = cx(styles.item, className, {
      [`${styles.itemDisabled}`]:
        typeof disabled === 'function'
          ? disabled({
              event: nativeEvent,
              dataFromProvider,
              ref: refsFromProvider
            })
          : disabled
    });
    const submenuStyle = {
      ...style,
      ...this.state.style
    };

    return (
      <div
        className={cssClasses}
        role="presentation"
      >
        <div
          className={styles.itemContent}
          onClick={this.handleClick}
          ref={this.setRef}
        >
          {label}
          <span className={styles.submenuArrow}>{arrow}</span>
        </div>
        <div
          className={styles.submenu}
          ref={this.setMenuRef}
          style={submenuStyle}
        >
          {this.getMenuItem()}
        </div>
      </div>
    );
  }
}
