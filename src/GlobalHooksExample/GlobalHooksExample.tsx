import React, { useRef } from 'react';

import {
  StoreTools,
  createGlobalState,
  createGlobalStateWithDecoupledFuncs,
} from 'react-global-state-hooks';

/**
 * This is how you create a global state hook.
 */
const useGlobalNumber = createGlobalState(1);

/**
 * The second argument is optional and it can be use to confure local storage persistence
 * or to specify the actions that can be performed on the state.
 */
const useUserInfo = createGlobalState(
  {
    name: 'John Doe',
    age: 20,
    birthday: new Date(),
  },
  {
    localStorage: {
      key: 'user-info',
      encrypt: true,
    },
  }
);

type ICounterState = {
  count1: number;
  count2: number;
};

const initialState: ICounterState = {
  count1: 0,
  count2: 0,
};

/**
 * This is how you create a global state hook with decoupled access to the state and actions.
 * the useCount is a hook like the one created with createGlobalState.
 * The _getCount is a function that returns the current state.
 * The countStoreActions is an object that contains all the actions that can be performed on the state.
 * if actions are not specified the 3 position of the tuple will be a setState function.
 */
const [useCounter, _getCounter, counterActions] =
  createGlobalStateWithDecoupledFuncs(initialState, {
    actions: {
      increase: () => {
        return ({ setState }: StoreTools<ICounterState>) => {
          setState((state) => ({
            ...state,
            count1: state.count1 + 1,
          }));
        };
      },
      decrease: () => {
        return ({ setState }: StoreTools<ICounterState>) => {
          setState((state) => ({
            ...state,
            count1: state.count1 - 1,
          }));
        };
      },
      countTwoAdd: (num: number) => {
        return ({ setState }: StoreTools<ICounterState>) => {
          setState((state) => ({
            ...state,
            count2: state.count2 + num,
          }));
        };
      },
    } as const,
  });

const useRenderCount = () => {
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;

  return renderCountRef.current;
};

export const GlobalHooksExample: React.FC = () => {
  return (
    <div className='flex flex-col gap-3 items-center bg-stone-50 p-4'>
      <h1 className='text-2xl text-center font-bold'>Global Hooks</h1>
      <p>You can see the current value of the states at the right</p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center'>
        <GlobalNumberInput />

        <UserInfo />

        <div className='flex flex-col gap-3'>
          <div className='grid grid-cols-3 gap-4'>
            <Component1 />
            <Component2 />
            <Component3 />

            <p className='col-span-2 w-64'>
              The first two components are using a selector to subscribe only to
              the <strong className='text-red-500'>count1</strong> property of
              the state.
            </p>

            <p className='col-span-1 w-32'>
              The third component subscribes only to the{' '}
              <strong className='text-red-500'>count2</strong>
            </p>
          </div>

          <CountSetter />
        </div>

        <StoreJsons />
      </div>
    </div>
  );
};

const Component1: React.FC = () => {
  const [count] = useCounter((state) => state.count1);
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-blue-100 rounded-md w-32 flex flex-col gap-3'>
      <span className=''>Frist: </span>
      <p>
        <span className=' font-bold'>Count #1:</span> {count}
      </p>
      <p className='text-sm'>Renders: {renderCount}</p>
    </div>
  );
};

const Component2: React.FC = () => {
  const [count] = useCounter((state) => state.count1);
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-green-100 rounded-md w-32 flex flex-col gap-3'>
      <span className=''>Second: </span>
      <p>
        <span className=' font-bold'>Count #1:</span> {count}
      </p>
      <p className='text-sm'>Renders: {renderCount}</p>
    </div>
  );
};

const Component3: React.FC = () => {
  const [count] = useCounter((state) => state.count2);
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-orange-100 rounded-md w-32 flex flex-col gap-3'>
      <p className=''>Third: </p>
      <p>
        <span className=' font-bold'>Count #2:</span> {count}
      </p>
      <p className='text-sm'>Renders: {renderCount}</p>
    </div>
  );
};

const CountSetter: React.FC = () => {
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-yellow-100 rounded-md flex gap-3 justify-between'>
      <div className='flex flex-col gap-3 w-32'>
        <div className='font-bold'>Count #1</div>

        <button
          className='bg-blue-500 text-white px-2 py-1 rounded'
          onClick={counterActions.increase}
        >
          Increment
        </button>
        <button
          className='bg-red-500 text-white px-2 py-1 rounded'
          onClick={counterActions.decrease}
        >
          Decrement
        </button>
      </div>

      <div className='flex flex-col gap-3 w-32'>
        <div className='font-bold'>Count #2</div>
        <button
          className='bg-blue-500 text-white px-2 py-1 rounded'
          onClick={() => counterActions.countTwoAdd(1)}
        >
          Increment
        </button>
        <button
          className='bg-red-500 text-white px-2 py-1 rounded'
          onClick={() => counterActions.countTwoAdd(-1)}
        >
          Decrement
        </button>
      </div>

      <div className='text-sm w-32'>
        <h1 className='font-bold'>Renders: {renderCount}</h1>
        This component is not subscribed to any state, it only uses the actions
      </div>
    </div>
  );
};

const UserInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useUserInfo();

  return (
    <div className='p-4 bg-stone-200 rounded-md flex flex-col gap-3'>
      <div className='font-bold text-center'>User Info</div>
      <p>
        Persisted in LocalStorage. Refresh the page to see the persisted data.
      </p>

      <div className='flex flex-col gap-2'>
        <span className='font-bold'>Name: </span>
        <input
          autoComplete='off'
          type='text'
          value={userInfo.name}
          onChange={(e) => {
            setUserInfo((state) => ({
              ...state,
              name: e.target.value,
            }));
          }}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <span className='font-bold'>Age: </span>
        <input
          autoComplete='off'
          type='number'
          value={userInfo.age}
          onChange={(e) => {
            setUserInfo((state) => ({
              ...state,
              age: Number(e.target.value),
            }));
          }}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <span className='font-bold'>Birthday: </span>
        <input
          autoComplete='off'
          type='date'
          value={userInfo.birthday.toISOString().split('T')[0]}
          onChange={(e) => {
            setUserInfo((state) => ({
              ...state,
              birthday: new Date(e.target.value),
            }));
          }}
        />
      </div>
      <p className='text-xs'>
        The default storage suports multiples types of data like Sets, Maps,
        Objects, Arrays, and Primitive data like Dates, Strings,and Numbers.
      </p>
    </div>
  );
};

const GlobalNumberInput: React.FC = () => {
  const [globalNumber, setGlobalNumber] = useGlobalNumber();

  return (
    <div className='flex flex-col gap-3 bg-stone-200 rounded-md p-4  h-fit'>
      <span className='font-bold'>Number: </span>
      <input
        autoComplete='off'
        type='number'
        value={globalNumber}
        onChange={(e) => {
          setGlobalNumber(Number(e.target.value));
        }}
      />
    </div>
  );
};

const StoreJsons: React.FC = () => {
  const [counters] = useCounter();
  const [num] = useGlobalNumber();
  const [userInfo] = useUserInfo();

  return (
    <div className='flex flex-col gap-3 overflow-hidden'>
      <div className='bg-stone-200 p-4 rounded-md'>
        <span className='font-bold text-xs mb-2'>Number:</span>
        <pre>{JSON.stringify(num, null, 2)}</pre>
      </div>

      <div className='bg-stone-200 p-4 rounded-md'>
        <span className='font-bold text-xs mb-2'>User Info:</span>
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      </div>

      <div className='bg-stone-200 p-4 rounded-md'>
        <span className='font-bold text-xs mb-2'>Counters:</span>
        <pre>{JSON.stringify(counters, null, 2)}</pre>
      </div>
    </div>
  );
};
