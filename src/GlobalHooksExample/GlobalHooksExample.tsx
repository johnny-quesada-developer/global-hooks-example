import React, { useRef } from 'react';
import { createGlobalState } from 'react-global-state-hooks/createGlobalState';
import '../SnakeElement';

type ICounterState = {
  n1: number;
  n2: number;
};

const initialState: ICounterState = {
  n1: 0,
  n2: 0,
};

const useCounter = createGlobalState(initialState, {
  actions: {
    increaseN1: () => {
      return ({ setState }) => {
        setState((state) => ({
          ...state,
          n1: state.n1 + 1,
        }));
      };
    },
    decreaseN1: () => {
      return ({ setState }) => {
        setState((state) => ({
          ...state,
          n1: state.n1 - 1,
        }));
      };
    },
    increaseN2: (num: number) => {
      return ({ setState }) => {
        setState((state) => ({
          ...state,
          n2: state.n2 + num,
        }));
      };
    },
  },
});

const [getCounters, counters] = useCounter.stateControls();

export const GlobalHooksExample: React.FC = () => {
  return (
    <div className="bg-stone-50 flex items-center justify-center">
      <div className="p-10 w-full md:w-1/2 pt-10 flex flex-col md:grid md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-3 border border-stone-900 p-6 rounded-md">
          <h1 className="text-2xl text-center font-bold">Global Hooks</h1>

          <div className="grid grid-cols-3 gap-4">
            <Component1 />
            <Component2 />
            <Component3 />

            <p className="col-span-2 w-64">
              The first two components are using a selector to subscribe only to the{' '}
              <strong className="text-red-500">N_1</strong> property of the state.
            </p>

            <p className="col-span-1 w-32">
              The third component subscribes only to the <strong className="text-red-500">N_2</strong>
            </p>
          </div>

          <CountSetter />

          <code className="bg-stone-200 text-blue-800 p-4 w-full rounded-md text-xs">
            <pre>{`const [n1] = useCounter((state) => state.n1);`}</pre>
            <br />
            <pre>{`const [n2] = useCounter((state) => state.n2);`}</pre>
          </code>
        </div>

        <div className="flex flex-col gap-6 p-6 items-center border border-stone-900 bg-stone-100 rounded-md">
          <snake-game interval-speed={100} matrix={10} />

          <p className="">
            Here we are using a global state to move information from a{' '}
            <span className=" font-bold">custom html</span> element to a react component.
          </p>

          <code className="bg-stone-200 text-blue-800 p-4 w-full rounded-md text-xs">
            {'<snake-game interval-speed={100} matrix={10} />'}
          </code>

          <p className=" w-full">Only the cell with changes will be re-rendered.</p>
        </div>

        <UserInfo />
        <StoreJson />
      </div>
    </div>
  );
};

const Component1: React.FC = () => {
  const [n1] = useCounter((state) => state.n1);
  const renderCounter = useRenderCounter();

  return (
    <div className="p-4 bg-blue-100 rounded-md w-32 flex flex-col gap-3">
      <p>
        <span className=" font-bold">N_1:</span> {n1}
      </p>
      <p className="text-sm">Renders: {renderCounter}</p>
    </div>
  );
};

const Component2: React.FC = () => {
  const [n1] = useCounter((state) => state.n1);
  const renderCounter = useRenderCounter();

  return (
    <div className="p-4 bg-green-100 rounded-md w-32 flex flex-col gap-3">
      <p>
        <span className=" font-bold">N_1:</span> {n1}
      </p>
      <p className="text-sm">Renders: {renderCounter}</p>
    </div>
  );
};

const Component3: React.FC = () => {
  const [n2] = useCounter((state) => state.n2);
  const renderCounter = useRenderCounter();

  return (
    <div className="p-4 bg-orange-100 rounded-md w-32 flex flex-col gap-3">
      <p>
        <span className=" font-bold">N_2:</span> {n2}
      </p>
      <p className="text-sm">Renders: {renderCounter}</p>
    </div>
  );
};

const CountSetter: React.FC = () => {
  const renderCounter = useRenderCounter();

  console.log(`counters: ${JSON.stringify(getCounters())}`);

  return (
    <div className="p-4 bg-yellow-100 rounded-md flex gap-3 justify-between">
      <div className="flex flex-col gap-3 w-32">
        <div className="font-bold">N_1</div>

        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={counters.increaseN1}>
          Increment
        </button>
        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={counters.decreaseN1}>
          Decrement
        </button>
      </div>

      <div className="flex flex-col gap-3 w-32">
        <div className="font-bold">N_2</div>
        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => counters.increaseN2(1)}>
          Increment
        </button>
        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => counters.increaseN2(-1)}>
          Decrement
        </button>
      </div>

      <div className="text-sm w-32">
        <h1 className="font-bold">Renders: {renderCounter}</h1>
        This component is not subscribed to any state, it only uses the actions
      </div>
    </div>
  );
};

const UserInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useUserInfo();

  return (
    <div className="p-4 bg-stone-200 rounded-md flex flex-col gap-3">
      <div className="font-bold text-center">User Info</div>
      <p>Persisted in LocalStorage. Refresh the page to see the persisted data.</p>

      <div className="flex flex-col gap-2">
        <span className="font-bold">Name: </span>
        <input
          autoComplete="off"
          type="text"
          value={userInfo.name}
          onChange={(e) => {
            setUserInfo((state) => ({
              ...state,
              name: e.target.value,
            }));
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-bold">Age: </span>
        <input
          autoComplete="off"
          type="number"
          value={userInfo.age}
          onChange={(e) => {
            setUserInfo((state) => ({
              ...state,
              age: Number(e.target.value),
            }));
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-bold">Birthday: </span>
        <input
          autoComplete="off"
          type="date"
          value={parseDateToISOString(userInfo.birthday)}
          onChange={(e) => {
            try {
              setUserInfo((state) => ({
                ...state,
                birthday: new Date(e.target.value) ?? new Date('Invalid date'),
              }));
            } catch (error) {
              console.error('Invalid date');
            }
          }}
        />
      </div>
      <p className="text-xs">
        The default storage suports multiples types of data like Sets, Maps, Objects, Arrays, and Primitive
        data like Dates, Strings,and Numbers.
      </p>

      <code className="bg-white text-blue-800 p-4 w-full rounded-md text-xs">{'<UserInfo />'}</code>
    </div>
  );
};

const StoreJson: React.FC = () => {
  const [counters] = useCounter();
  const [userInfo] = useUserInfo();

  return (
    <div className="flex p-4  bg-stone-200 flex-col gap-3 overflow-hidden">
      <h1 className="font-bold text-center">Json</h1>

      <div className=" rounded-md">
        <span className="font-bold text-xs mb-2">User Info:</span>
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      </div>

      <div className="rounded-md">
        <span className="font-bold text-xs mb-2">Counters:</span>
        <pre>{JSON.stringify(counters, null, 2)}</pre>
      </div>

      <code className="bg-white p-4  text-blue-800 w-full rounded-md text-xs">{'<StoreJson />'}</code>
    </div>
  );
};

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

const parseDateToISOString = (date: Date) => {
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    return 'Invalid date';
  }
};

const useRenderCounter = () => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return renderCountRef.current;
};
