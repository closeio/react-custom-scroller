import { useLayoutEffect, useEffect, useRef, useState, useCallback } from 'react';

/**
 * canUseDOM utility to check the current environment (client side, server side)
 */
const canUseDOM = () =>
  !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * useSafeLayoutEffect enables us to safely call `useLayoutEffect` on the browser (for SSR reasons)
 */
const useSafeLayoutEffect = canUseDOM() ? useLayoutEffect : useEffect;

/**
 * We use a negative right on the content to hide original OS scrollbars
 */
const OS_SCROLLBAR_WIDTH = (() => {
  const outer = document.createElement('div');
  const inner = document.createElement('div');
  outer.style.overflow = 'scroll';
  outer.style.width = '100%';
  inner.style.width = '100%';

  document.body.appendChild(outer);
  outer.appendChild(inner);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.removeChild(inner);
  document.body.removeChild(outer);

  return scrollbarWidth;
})();

/**
 * We need this for OSs that automatically hide the scrollbar (so the offset
 * doesn't change in such case). Eg: macOS with "Automatically based on mouse".
 */
const SCROLLBAR_WIDTH = OS_SCROLLBAR_WIDTH || 20;

/**
 * Ported from Vitor's SimpleScrollbar library (vanilla JS):
 * https://github.com/buzinas/simple-scrollbar
 */
type Options = { disabled?: boolean };
type MemoizedProps = {
  clientHeight: number;
  scrollHeight: number;
  trackHeight: number;
};
export function useCustomScroller(
  content: React.ReactNode,
  customRef: React.MutableRefObject<HTMLDivElement | null>,
  options: Options = {},
) {
  const { disabled } = options;
  const [scrollRatio, setScrollRatio] = useState(1);
  const [isDraggingTrack, setIsDraggingTrack] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollerRef = customRef || ref;
  const trackRef = useRef<HTMLDivElement>(null);
  const trackAnimationRef = useRef<number | null>(null);
  const memoizedProps = useRef<MemoizedProps | null>(null);

  useSafeLayoutEffect(() => {
    const element = scrollerRef.current;
    if (!element) return;
    let scrollbarAnimation: number;

    const updateScrollbar = () => {
      window.cancelAnimationFrame(scrollbarAnimation);
      scrollbarAnimation = window.requestAnimationFrame(() => {
        if (!trackRef.current) return;
        const { clientHeight, scrollHeight } = element;
        setScrollRatio(clientHeight / scrollHeight);
        memoizedProps.current = {
          clientHeight,
          scrollHeight,
          trackHeight: trackRef.current.clientHeight,
        };
      });
    };

    window.addEventListener('resize', updateScrollbar);
    updateScrollbar();

    return () => {
      window.cancelAnimationFrame(scrollbarAnimation);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [scrollerRef, content]);

  useSafeLayoutEffect(() => {
    const element = scrollerRef.current;
    if (!element || !disabled) return;

    const onWheel = (event: Event) => event.preventDefault();
    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', onWheel);
    };
  }, [scrollerRef, disabled]);

  const onScroll = useCallback(() => {
    const element = scrollerRef.current;
    const track = trackRef.current;
    if (!element || !track || scrollRatio === 1) return;

    window.cancelAnimationFrame(trackAnimationRef.current as number);

    trackAnimationRef.current = window.requestAnimationFrame(() => {
      const { clientHeight, scrollHeight, trackHeight } = memoizedProps.current as MemoizedProps;
      const ratio = element.scrollTop / (scrollHeight - clientHeight);
      const y = ratio * (clientHeight - trackHeight);
      track.style.transform = `translateY(${y}px)`;
    });
  }, [scrollerRef, scrollRatio]);

  const moveTrack = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const element = scrollerRef.current;
      if (!element) return;
      let moveAnimation: number;
      let lastPageY = event.pageY;
      let lastScrollTop = element.scrollTop;

      setIsDraggingTrack(true);

      const drag = (_event: MouseEvent) => {
        const { pageY } = _event;
        window.cancelAnimationFrame(moveAnimation);
        moveAnimation = window.requestAnimationFrame(() => {
          const delta = pageY - lastPageY;
          lastScrollTop += delta / scrollRatio;
          lastPageY = pageY;
          element.scrollTop = lastScrollTop;
        });
      };

      const stop = () => {
        setIsDraggingTrack(false);
        window.removeEventListener('mousemove', drag);
      };

      window.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', stop, { once: true });
    },
    [scrollerRef, scrollRatio],
  );

  const getWrapperProps = () => ({
    style: {
      marginLeft: `-${SCROLLBAR_WIDTH}px`,
    },
  });

  const getScrollerProps = () => ({
    ref: scrollerRef,
    onScroll: disabled ? undefined : onScroll,
    style: {
      right: `-${SCROLLBAR_WIDTH}px`,
      padding: `0 ${SCROLLBAR_WIDTH}px 0 0`,
      width: `calc(100% + ${OS_SCROLLBAR_WIDTH}px)`,
    },
  });

  const getTrackProps = () => ({
    ref: trackRef as React.MutableRefObject<HTMLDivElement>,
    onMouseDown: disabled ? undefined : moveTrack,
    style: {
      right: isDraggingTrack ? 1 : undefined,
      width: isDraggingTrack ? 10 : undefined,
      height: `${scrollRatio * 100}%`,
      opacity: isDraggingTrack ? 1 : undefined,
      display: disabled || scrollRatio === 1 ? 'none' : undefined,
    },
  });

  return { getWrapperProps, getScrollerProps, getTrackProps };
}
