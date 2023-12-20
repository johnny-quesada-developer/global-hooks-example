import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
} from 'react';

interface CountSetter {
  increase: () => void;
  decrease: () => void;
}

const CountValueContext = createContext<number>(0);

const CountSetterContext = createContext<CountSetter>({
  increase: () => {},
  decrease: () => {},
});

const useCount = () => {
  const value = useContext(CountValueContext);

  if (value === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }

  return value;
};

const useCountSetter = () => {
  const { increase, decrease } = useContext(CountSetterContext);

  if (increase === undefined || decrease === undefined) {
    throw new Error('useCountSetter must be used within a CountProvider');
  }

  return { increase, decrease } as const;
};

const useRenderCount = () => {
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;

  return renderCountRef.current;
};

const CountProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [count, setCount] = useState<number>(0);

  const countSetter = useMemo(() => {
    const increase = () => {
      setCount((prevCount) => prevCount + 1);
    };

    const decrease = () => {
      setCount((prevCount) => prevCount - 1);
    };

    return { increase, decrease };
  }, []);

  return (
    <CountSetterContext.Provider value={countSetter}>
      <CountValueContext.Provider value={count}>
        {children}
      </CountValueContext.Provider>
    </CountSetterContext.Provider>
  );
};

const Component1: React.FC = () => {
  const count = useCount();
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-blue-100 rounded-md'>
      <p className='font-bold'>Component 1 Count: {count}</p>
      <p>Render Count: {renderCount}</p>
    </div>
  );
};

const Component2: React.FC = () => {
  const count = useCount();
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-green-100 rounded-md mt-4'>
      <p className='font-bold'>Component 2 Count: {count}</p>
      <p>Render Count: {renderCount}</p>
    </div>
  );
};

const CountSetter: React.FC = () => {
  const { increase, decrease } = useCountSetter();
  const renderCount = useRenderCount();

  return (
    <div className='p-4 bg-yellow-100 rounded-md mt-4'>
      <button
        className='mr-2 bg-blue-500 text-white px-2 py-1 rounded'
        onClick={increase}
      >
        Increment
      </button>
      <button
        className='bg-red-500 text-white px-2 py-1 rounded'
        onClick={decrease}
      >
        Decrement
      </button>
      <p>Render Count: {renderCount}</p>
    </div>
  );
};

export const ReactContextExample: React.FC = () => {
  return (
    <CountProvider>
      <div className='p-4 w-96 flex flex-col gap-2'>
        <h1 className='text-2xl text-center font-bold flex gap-3'>
          React Context
        </h1>

        <Component1 />
        <Component2 />
      </div>
      <CountSetter />
    </CountProvider>
  );
};
