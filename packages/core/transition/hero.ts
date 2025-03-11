import { cubicOut } from '../easing';
import { out } from './boilerplate';
import type { GetTransitionConfig, TransitionFactory } from '../types';

const DATA_HERO_KEY = 'data-hero-key';

const getHeroEl = (page: HTMLElement, key: string): HTMLElement | null =>
  page.querySelector(`[${DATA_HERO_KEY}="${key}"]`);

const findCommonKey = (fromPage: HTMLElement, toPage: HTMLElement): string | null => {
  const fromKeys = new Set(
    Array.from(fromPage.querySelectorAll(`[${DATA_HERO_KEY}]`)).map(el =>
      el.getAttribute(DATA_HERO_KEY)
    )
  );
  const toKeys = new Set(
    Array.from(toPage.querySelectorAll(`[${DATA_HERO_KEY}]`)).map(el =>
      el.getAttribute(DATA_HERO_KEY)
    )
  );

  for (const key of fromKeys) {
    if (toKeys.has(key)) {
      return key;
    }
  }
  return null;
};

const hero =
  (): TransitionFactory<{
    duration?: number;
    delay?: number;
    easing?: (t: number) => number;
  }> =>
  ({ duration = 500, delay = 0, easing = cubicOut } = {}) => {
    let to_receive: HTMLElement | null = null;
    let to_send: HTMLElement | null = null;

    const transition = (
      setItem: (node: HTMLElement) => void,
      getCounterpart: () => HTMLElement | null,
      clearCounterpart: () => void,
      intro: boolean
    ): GetTransitionConfig => {
      return (node: HTMLElement, { getFromScrollTop, getToScrollTop }) => {
        setItem(node);
        return () => {
          const other_node = getCounterpart();
          if (!other_node) {
            clearCounterpart();
            return {
              duration: 0,
              delay,
              easing,
              css: () => (intro ? '' : out),
            };
          }

          const from_node = intro ? other_node : node;
          const to_node = intro ? node : other_node;

          const commonKey = findCommonKey(from_node, to_node);
          if (!commonKey) {
            clearCounterpart();
            return {
              duration: 0,
              delay,
              easing,
              css: () => (intro ? '' : out),
            };
          }

          const fromEl = getHeroEl(from_node, commonKey);
          const toEl = getHeroEl(to_node, commonKey);

          if (!fromEl || !toEl) {
            clearCounterpart();
            return {
              duration: 0,
              delay,
              easing,
              css: () => (intro ? '' : out),
            };
          }

          const fromRect = getRect(from_node, fromEl);
          const toRect = getRect(to_node, toEl);
          const scrollTopDiff = getToScrollTop() - getFromScrollTop();

          clearCounterpart();

          if (!intro) {
            return {
              duration,
              css: () => out,
            };
          }

          const currentStyle = toEl.getAttribute('style') || '';
          const dx = fromRect.left - toRect.left;
          const dy = fromRect.top - toRect.top + scrollTopDiff;

          const dw = fromRect.width / toRect.width;
          const dh = fromRect.height / toRect.height;

          return {
            duration,
            delay,
            easing,
            tick: (t: number) => {
              if (!toEl) return;

              toEl.setAttribute(
                'style',
                `${currentStyle}
                position: relative;
                transform-origin: top left;
                transform: translate(${(1 - t) * dx}px,${(1 - t) * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
                `
              );
            },
          };
        };
      };
    };

    return {
      in: transition(
        node => {
          to_receive = node;
        },
        () => to_send,
        () => {
          to_send = null;
        },
        true
      ),
      out: transition(
        node => {
          to_send = node;
        },
        () => to_receive,
        () => {
          to_receive = null;
        },
        false
      ),
    };
  };

const getRect = (root: HTMLElement, el: HTMLElement): DOMRect => {
  return new DOMRect(
    el.getBoundingClientRect().left - root.getBoundingClientRect().left,
    el.getBoundingClientRect().top - root.getBoundingClientRect().top,
    el.getBoundingClientRect().width,
    el.getBoundingClientRect().height
  );
};

export default hero();
