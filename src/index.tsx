import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import useCustomScroller from './useCustomScroller';

import styles from './index.module.css';

const cx = (...args: (string | undefined | boolean)[]) =>
  args.filter(Boolean).join(' ');

type CustomScrollerProps = {
  scrollDisabled?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const CustomScroller = forwardRef<HTMLDivElement, CustomScrollerProps>(
  (
    { scrollDisabled = false, className, innerClassName, children, ...props },
    ref,
  ) => {
    const [wrapperProps, scrollerProps, trackProps] = useCustomScroller(
      ref !== null && 'current' in ref ? ref : undefined,
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

CustomScroller.displayName = 'CustomScroller';

export default CustomScroller;
