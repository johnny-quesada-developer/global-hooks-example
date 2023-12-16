import React, { useRef } from 'react';

import {
  StoreTools,
  createGlobalStateWithDecoupledFuncs,
} from 'react-global-state-hooks';

type ICountState = {
  count: number;
  count2: number;
};

const [useCount, _getCount, countStoreActions] =
  createGlobalStateWithDecoupledFuncs(
    {
      count: 0,
      count2: 0,
    } as ICountState,
    {
      actions: {
        increase: (increaseBy = 1) => {
          return ({ setState }: StoreTools<ICountState>) => {
            setState((state) => ({
              ...state,
              count: state.count + increaseBy,
            }));
          };
        },
        decrease: () => {
          return ({ setState }: StoreTools<ICountState>) => {
            setState((state) => ({
              ...state,
              count: state.count - 1,
            }));
          };
        },
      } as const,
    }
  );

const useRenderCount = () => {
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;

  return renderCountRef.current;
};

const Component1: React.FC = () => {
  const [count] = useCount((state) => state.count);
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-blue-100 rounded-md'>
      <p className='font-bold'>Component 1 Count: {count}</p>
      <p>Render Count: {renderCount}</p>
    </div>
  );
};

const Component2: React.FC = () => {
  const [count] = useCount((state) => state.count);
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-green-100 rounded-md mt-4'>
      <p className='font-bold'>Component 2 Count: {count}</p>
      <p>Render Count: {renderCount}</p>
    </div>
  );
};

const Component3: React.FC = () => {
  const [count] = useCount((state) => state.count2);
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-orange-100 rounded-md'>
      <p className='font-bold'>Component 3 Count: {count}</p>
      <p>Render Count: {renderCount}</p>
    </div>
  );
};

const CountSetter: React.FC = () => {
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-yellow-100 rounded-md mt-4'>
      <button
        className='mr-2 bg-blue-500 text-white px-2 py-1 rounded'
        onClick={() => countStoreActions.increase(2)}
      >
        Increment
      </button>
      <button
        className='bg-red-500 text-white px-2 py-1 rounded'
        onClick={countStoreActions.decrease}
      >
        Decrement
      </button>
      <p>Render Count: {renderCount}</p>
    </div>
  );
};

export const GlobalHooksExample: React.FC = () => {
  return (
    <div className='p-4 w-96 flex flex-col gap-2'>
      <h1 className='text-2xl text-center font-bold'>Global Hooks</h1>

      <Component1 />
      <Component2 />
      <Component3 />
      <CountSetter />
    </div>
  );
};
