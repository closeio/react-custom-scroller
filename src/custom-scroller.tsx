import * as React from 'react';

import type { CustomScrollerProps as Props } from './custom-scroller.props';
import { useCustomScroller } from './custom-scroller.hooks';
import { useCustomScrollerStyles } from './custom-scroller.styles';
import './custom-scroller.css';

export const CustomScroller = React.forwardRef((props: Props, ref: Props['ref']) => {
  const { scrollDisabled, innerClassName, className, children, ...htmlAttr } = props;
  const { getWrapperProps, getScrollerProps, getTrackProps } = useCustomScroller(
    children,
    ref as React.MutableRefObject<HTMLDivElement | null>,
    {
      disabled: scrollDisabled,
    },
  );
  const { mainClassName, wrapperClassName, scrollerClassName, trackClassName } =
    useCustomScrollerStyles({ className, innerClassName });

  return (
    <div className={mainClassName} {...htmlAttr}>
      <div className={wrapperClassName} {...getWrapperProps()}>
        <div className={scrollerClassName} {...getScrollerProps()}>
          {children}
        </div>
      </div>
      <div className={trackClassName} {...getTrackProps()} />
    </div>
  );
});

CustomScroller.displayName = 'CustomScroller';

export default CustomScroller;
