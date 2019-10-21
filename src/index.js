import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import useCustomScroller from './useCustomScroller';

import styles from './index.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const CustomScroller = forwardRef(
  ({ scrollDisabled, className, innerClassName, children, ...props }, ref) => {
    const [wrapperProps, scrollerProps, trackProps] = useCustomScroller(
      children,
      ref,
      { disabled: scrollDisabled },
    );

    return (
      <div className={cx(className, styles.main)} {...props}>
        <div className={styles.wrapper} {...wrapperProps}>
          <div className={cx(innerClassName, styles.inner)} {...scrollerProps}>
            {children}
          </div>
        </div>
        <div className={styles.track} {...trackProps} />
      </div>
    );
  },
);

CustomScroller.propTypes = {
  scrollDisabled: PropTypes.bool,
  innerClassName: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CustomScroller.displayName = 'CustomScroller';

export default CustomScroller;
