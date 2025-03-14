import type { TransitionFactory } from '../types';
import { cubicOut } from '../easing';
import { getRootRect } from '../utils';
import { out } from './boilerplate';

const getPinterestRect = (page: HTMLElement, key: string): DOMRect | null => {
  const element = page.querySelector(`[data-pinterest-key="${key}"]`);
  if (element == null) {
    return null;
  }

  const rect = page.getBoundingClientRect();
  if (rect == null) {
    return null;
  }
  const childRect = element.getBoundingClientRect();
  return new DOMRect(
    childRect.left - rect.left,
    childRect.top - rect.top,
    childRect.width,
    childRect.height
  );
};

const findCommonKey = (fromPage: HTMLElement, toPage: HTMLElement): string | null => {
  const fromKeys = new Set(
    Array.from(fromPage.querySelectorAll('[data-pinterest-key]')).map(el =>
      el.getAttribute('data-pinterest-key')
    )
  );
  const toKeys = new Set(
    Array.from(toPage.querySelectorAll('[data-pinterest-key]')).map(el =>
      el.getAttribute('data-pinterest-key')
    )
  );

  for (const key of fromKeys) {
    if (toKeys.has(key)) {
      return key;
    }
  }
  return null;
};

const detailIn = (
  toRect: DOMRect,
  fromRect: DOMRect,
  rootRect: DOMRect,
  scrollTopDiff: number,
  t: number
) => {
  // Calculate the distance between the start position (from) and the end position (to)
  const dx = toRect.left - fromRect.left + (toRect.width - fromRect.width) / 2;
  const dy = toRect.top - fromRect.top + (toRect.height - fromRect.height) / 2;

  // Calculate scale
  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.max(scaleX, scaleY);

  // Calculate clip-path
  const startTop = (fromRect.top / rootRect.height) * 100;
  const startRight = ((rootRect.width - (fromRect.left + fromRect.width)) / rootRect.width) * 100;
  const startBottom =
    ((rootRect.height - (fromRect.top + fromRect.height)) / rootRect.height) * 100;
  const startLeft = (fromRect.left / rootRect.width) * 100;

  const u = 1 - t;
  const currentTop = startTop * u;
  const currentRight = startRight * u;
  const currentBottom = startBottom * u;
  const currentLeft = startLeft * u;

  return `
    clip-path: inset(${currentTop}% ${currentRight}% ${currentBottom}% ${currentLeft}%);
    transform-origin: ${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px;
    transform: 
      translate(${dx * u}px, ${(dy + scrollTopDiff) * u}px)
      scale(${1 + (scale - 1) * u});
  `;
};

const detailOut = (
  fromRect: DOMRect,
  toRect: DOMRect,
  rootRect: DOMRect,
  scrollTopDiff: number,
  t: number
) => {
  // Calculate the distance between the start position (from) and the end position (to)
  const dx = toRect.left - fromRect.left + (toRect.width - fromRect.width) / 2;
  const dy = toRect.top - fromRect.top + (toRect.height - fromRect.height) / 2;

  // Calculate scale
  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.max(scaleX, scaleY);

  return `
    ${out}
    transform-origin: ${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2 + scrollTopDiff}px;
    transform: 
      translate(${dx * t}px, ${dy * t + scrollTopDiff}px)
      scale(${1 + (scale - 1) * t});
    opacity: ${1 - t};
  `;
};

const galleryOut = (
  fromRect: DOMRect,
  toRect: DOMRect,
  rootRect: DOMRect,
  scrollTopDiff: number,
  t: number
) => {
  // Calculate the distance between the start position (from) and the end position (to)
  const dx = toRect.left - fromRect.left + (toRect.width - fromRect.width) / 2;
  const dy = toRect.top - fromRect.top + (toRect.height - fromRect.height) / 2 - scrollTopDiff;

  // Calculate scale
  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.max(scaleX, scaleY);

  // Calculate clip-path
  const startTop = (fromRect.top / rootRect.height) * 100;
  const startRight = ((rootRect.width - (fromRect.left + fromRect.width)) / rootRect.width) * 100;
  const startBottom =
    ((rootRect.height - (fromRect.top + fromRect.height)) / rootRect.height) * 100;
  const startLeft = (fromRect.left / rootRect.width) * 100;

  const currentTop = startTop * t;
  const currentRight = startRight * t;
  const currentBottom = startBottom * t;
  const currentLeft = startLeft * t;

  return `
    ${out}
    clip-path: inset(${currentTop}% ${currentRight}% ${currentBottom}% ${currentLeft}%);
    transform-origin: ${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px;
    transform: 
      translate(${dx * t}px, ${dy * t + scrollTopDiff}px)
      scale(${1 + (scale - 1) * t});
    opacity: 1;
  `;
};

const galleryIn = (
  galleryRect: DOMRect,
  detailRect: DOMRect,
  _: DOMRect,
  scrollTopDiff: number,
  u: number
) => {
  const t = 1 - u;
  const dx = galleryRect.left - detailRect.left + (galleryRect.width - detailRect.width) / 2;
  const dy = galleryRect.top - detailRect.top + (galleryRect.height - detailRect.height) / 2;

  // Calculate scale
  const scaleX = galleryRect.width / detailRect.width;
  const scaleY = galleryRect.height / detailRect.height;
  const scale = Math.max(scaleX, scaleY);

  return `
    transform-origin: ${detailRect.left + detailRect.width / 2}px ${detailRect.top + detailRect.height / 2}px;
    transform: 
      translate(${dx * t}px, ${(dy + scrollTopDiff) * t}px)
      scale(${1 + (scale - 1) * t});
    opacity: ${u};
  `;
};

type PinterestTransition = (
  fromRect: DOMRect,
  toRect: DOMRect,
  rootRect: DOMRect,
  scrollTopDiff: number,
  t: number
) => string;

const pinterest = (
  inTransition: PinterestTransition,
  outTransition: PinterestTransition
): TransitionFactory<{
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}> => {
  return ({
    duration = 500,
    delay = 0,
    easing = cubicOut,
  }: { duration?: number; delay?: number; easing?: (t: number) => number } = {}) => {
    let to_receive: HTMLElement | null = null;
    let to_send: HTMLElement | null = null;

    function transition(
      setItem: (node: HTMLElement) => void,
      getCounterpart: () => HTMLElement | null,
      clearCounterpart: () => void,
      intro: boolean
    ) {
      return (
        node: HTMLElement,
        {
          getFromScrollTop,
          getToScrollTop,
        }: { getFromScrollTop: () => number; getToScrollTop: () => number }
      ) => {
        setItem(node);
        return () => {
          const other_node = getCounterpart();
          if (other_node) {
            const from_node = intro ? other_node : node;
            const to_node = intro ? node : other_node;

            const commonKey = findCommonKey(from_node, to_node);
            if (!commonKey) {
              clearCounterpart();
              return {};
            }

            const from_rect = getPinterestRect(from_node, commonKey);
            const to_rect = getPinterestRect(to_node, commonKey);
            const page = node.getBoundingClientRect();
            const root = getRootRect();
            const root_rect = new DOMRect(root.left, root.top, page.width, page.height);
            const scrollTopDiff = getToScrollTop() - getFromScrollTop();

            if (!from_rect || !to_rect) {
              clearCounterpart();
              return {
                duration: 0,
                delay,
                easing,
                css: (t: number) => `${intro ? '' : out}`, // fallback
              };
            }

            clearCounterpart();

            return {
              duration,
              delay,
              easing,
              css: (t: number, u: number) => `
                ${intro ? inTransition(from_rect, to_rect, root_rect, scrollTopDiff, t) : outTransition(from_rect, to_rect, root_rect, scrollTopDiff, u)}
              `,
            };
          }

          clearCounterpart();
          return {
            duration: 0,
            delay,
            easing,
            css: (t: number) => `${intro ? '' : out}`, // fallback
          };
        };
      };
    }

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
};

export default {
  enter: pinterest(detailIn, detailOut),
  exit: pinterest(galleryIn, galleryOut),
};
