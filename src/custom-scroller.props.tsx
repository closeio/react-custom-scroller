type BaseProps = {
  /**
   *
   */
  scrollDisabled?: boolean;
  /**
   *
   */
  innerClassName?: string;
};
export type HTMLDivElementAttributes = React.ComponentPropsWithRef<'div'>;

export type CustomScrollerProps = BaseProps & HTMLDivElementAttributes;
export type CustomScrollerStylesProps = Pick<CustomScrollerProps, 'className' | 'innerClassName'>;
