import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { debounce } from 'throttle-debounce';

// single instance ResizeObserver with ability to notify resize changes even for elements with
// overflow:hidden style by utilizing MutationObserver
const globalObserver = (() => {
  const resizeHandlers = new Map<Element, ResizeHandler[]>();
  const mutationObservers = new Map<Element, MutationObserver>();
  const observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
      const cachedEntry = resizeHandlers.get(entry.target);

      if (cachedEntry) {
        cachedEntry.forEach(handler => handler(entry));
      }
    });
  });
  return {
    register: (node: Element, handler: ResizeHandler) => {
      const cachedEntry = resizeHandlers.get(node);

      if (cachedEntry && cachedEntry.indexOf(handler) !== -1) {
        cachedEntry.push(handler);
        return;
      }
      resizeHandlers.set(node, [handler]);
      observer.observe(node);

      const mutationObserver = new MutationObserver(mutations => {
        // returning similar structure as resize observer with the target node dimensions
        mutations.forEach(() => {
          handler({ target: node, contentRect: node.getClientRects()[0] });
        });
      });
      mutationObservers.set(node, mutationObserver);
      mutationObserver.observe(node, { childList: true, subtree: true });
    },
    unregister: (node: Element) => {
      const cachedObserver = mutationObservers.get(node);

      if (resizeHandlers.has(node)) {
        resizeHandlers.delete(node);
      }

      if (cachedObserver) {
        cachedObserver.disconnect();
        mutationObservers.delete(node);
      }

      observer.unobserve(node);
    },
  };
})();

export const useElementResizeObserver = <T>(
  callback: ResizeHandler<T>,
): [SetNode, T | undefined] => {
  const [entry, setEntry] = useState<T | undefined>();
  const [node, setNode] = useState<Element | null>(null);

  const observe = useCallback(() => {
    if (node) {
      globalObserver.register(
        node,
        debounce(25, e => {
          setEntry(callback(e));
        }),
      );
    }
  }, [callback, node]);

  const unobserve = useCallback(() => {
    if (node) {
      globalObserver.unregister(node);
    }
  }, [node]);

  useEffect(() => {
    observe();
    return () => unobserve();
  }, [node, observe, unobserve]);

  return [setNode, entry];
};

export const useWindowResizeObserver = (callback: () => any) => {
  useEffect(() => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }, [callback]);
};

export type ResizeHandler<T = any> = (entry: ResizeObserverEntry) => T;
export type SetNode = Dispatch<SetStateAction<Element | null>>;
export interface Entry {
  contentRect: Partial<ResizeObserverEntry['contentRect']>;
}
