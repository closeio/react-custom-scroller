import type { CustomScrollerStylesProps } from './custom-scroller.props';
import { createClassName } from './custom-scroller.utils';

export function useCustomScrollerStyles(props: CustomScrollerStylesProps) {
  const { className, innerClassName } = props;
  const mainClassName = createClassName('custom-scroller', className);
  const wrapperClassName = createClassName('custom-scroller__wrapper');
  const scrollerClassName = createClassName('custom-scroller__inner', innerClassName);
  const trackClassName = createClassName('custom-scroller__track');

  return { mainClassName, wrapperClassName, scrollerClassName, trackClassName };
}
