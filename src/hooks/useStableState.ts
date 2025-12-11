import { useCallback, useRef, useState } from 'react';
import shallowCompare from 'react-global-state-hooks/shallowCompare';

const uniqueSymbol = Symbol('empty-state');

/**
 * - Only one stable initial render
 * - Only one stable cleanup every time dependencies change
 * - Initial render doesn't trigger cleanup
 * - Starts cold, returns null until the first render or fallback if provided
 */
const useStableState = <T>(
  builder: (tools: { recompute: () => void }) => T,
  dependencies: unknown[]
): {
  current: T;
  recompute: () => void;
} => {
  const [, setState] = useState({});

  const recompute = useCallback(() => {
    setState({});
  }, []);

  const state = useRef({
    current: uniqueSymbol as T | typeof uniqueSymbol,
    dependencies,
  });

  const shouldRebuild = !shallowCompare(dependencies, state.current.dependencies);

  if (shouldRebuild) {
    state.current.current = builder({ recompute });
  }

  state.current.dependencies = dependencies;

  return {
    current: state.current as T,
    recompute,
  };
};

export default useStableState;
