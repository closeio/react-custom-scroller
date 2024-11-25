import type { MouseEvent as ReactMouseEvent, MutableRefObject } from 'react';
import { useLayoutEffect, useRef, useState, useCallback } from 'react';

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

export default function useCustomScroller(
  customRef: MutableRefObject<HTMLDivElement | null> | undefined,
  { disabled }: { disabled: boolean } = { disabled: false },
) {
  const [scrollRatio, setScrollRatio] = useState(1);
  const [isDraggingTrack, setIsDraggingTrack] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const scrollerRef = customRef || ref;
  const trackRef = useRef<HTMLDivElement>(null);
  const trackAnimationRef = useRef(0);
  const memoizedProps = useRef<{
    clientHeight: number;
    scrollHeight: number;
    trackHeight: number;
  }>();

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let scrollbarAnimation: number;

    const updateScrollbar = () => {
      cancelAnimationFrame(scrollbarAnimation);
      scrollbarAnimation = requestAnimationFrame(() => {
        const { clientHeight, scrollHeight } = el;
        setScrollRatio(clientHeight / scrollHeight);
        memoizedProps.current = {
          clientHeight,
          scrollHeight,
          trackHeight: trackRef.current?.clientHeight ?? 0,
        };
      });
    };

    window.addEventListener('resize', updateScrollbar);
    updateScrollbar();

    return () => {
      cancelAnimationFrame(scrollbarAnimation);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [scrollerRef]);

  useLayoutEffect(() => {
    if (!disabled) return;
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [scrollerRef, disabled]);

  const onScroll = useCallback(() => {
    if (scrollRatio === 1) return;
    const el = scrollerRef.current;
    const track = trackRef.current;

    if (!el || !track) return;

    cancelAnimationFrame(trackAnimationRef.current);

    trackAnimationRef.current = requestAnimationFrame(() => {
      if (!memoizedProps.current) return;
      const { clientHeight, scrollHeight, trackHeight } = memoizedProps.current;
      const ratio = el.scrollTop / (scrollHeight - clientHeight);
      const y = ratio * (clientHeight - trackHeight);
      track.style.transform = `translateY(${y}px)`;
    });
  }, [scrollerRef, scrollRatio]);

  const moveTrack = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const el = scrollerRef.current;
      if (!el) return;

      let moveAnimation: number;
      let lastPageY = e.pageY;
      let lastScrollTop = el.scrollTop;

      setIsDraggingTrack(true);

      const drag = ({ pageY }: MouseEvent) => {
        cancelAnimationFrame(moveAnimation);
        moveAnimation = requestAnimationFrame(() => {
          const delta = pageY - lastPageY;
          lastScrollTop += delta / scrollRatio;
          lastPageY = pageY;
          el.scrollTop = lastScrollTop;
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

  const wrapperProps = {
    style: {
      marginLeft: `-${SCROLLBAR_WIDTH}px`,
    },
  };

  const scrollerProps = {
    ref: scrollerRef,
    onScroll: disabled ? undefined : onScroll,
    style: {
      right: `-${SCROLLBAR_WIDTH}px`,
      padding: `0 ${SCROLLBAR_WIDTH}px 0 0`,
      width: `calc(100% + ${OS_SCROLLBAR_WIDTH}px)`,
    },
  };

  const trackProps = {
    ref: trackRef,
    onMouseDown: disabled ? undefined : moveTrack,
    style: {
      right: isDraggingTrack ? 1 : undefined,
      width: isDraggingTrack ? 10 : undefined,
      height: `${scrollRatio * 100}%`,
      opacity: isDraggingTrack ? 1 : undefined,
      display: disabled || scrollRatio === 1 ? 'none' : undefined,
    },
  };

  return [wrapperProps, scrollerProps, trackProps] as const;
}
