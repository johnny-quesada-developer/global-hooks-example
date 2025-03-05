import React, { useRef, useState } from 'react';
import merge from 'easy-css-merge';
import styles from './GlobalHooksExample.module.scss';
import { createGlobalState } from 'react-global-state-hooks/createGlobalState';

const Title: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({
  className = '',
  children,
}) => {
  return <h1 className={merge(className, 'text-2xl font-bold text-text-title')}>{children}</h1>;
};

const SubTitle: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({
  className = '',
  children,
}) => {
  return <h2 className={merge(className, 'text-xl font-semibold text-text-subtitle')}>{children}</h2>;
};

const Container: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={merge(
        className,
        ' overflow-hidden bg-background-primary rounded-md p-6 border-emphasis-primary border'
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={merge(
        className,
        'bg-emphasis-primary text-background-primary px-4 py-2 rounded-md',
        'hover:bg-emphasis-secondary transition-colors duration-300'
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const CodeBlock: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({
  className = '',
  children,
}) => {
  return (
    <code
      className={merge(
        className,
        styles.code,
        'bg-white p-6 rounded-md border-emphasis-secondary border',
        ' flex-wrap'
      )}
    >
      {children}
    </code>
  );
};

const simpleCounterExample = (() => {
  const useCounter = createGlobalState(0);

  const ComponentA = () => {
    const [count, setCount] = useCounter();
    return (
      <Container className="flex justify-between items-center flex-wrap">
        <Button onClick={() => setCount((prev) => prev + 1)}>Increment</Button>
        <label>{count}</label>
      </Container>
    );
  };

  const ComponentB = () => {
    const [count, setCount] = useCounter();

    return (
      <Container className="flex justify-between items-center flex-wrap">
        <Button onClick={() => setCount((prev) => prev - 1)}>Decrement</Button>
        <label>{count}</label>
      </Container>
    );
  };

  return (
    <>
      <Container className="grid grid-cols-2 gap-6 auto-rows-min items-start">
        <SubTitle className="col-span-2">How to create a global state?</SubTitle>

        <ComponentA />
        <ComponentB />

        <CodeBlock className="col-span-2">
          <pre className="text-xs">{`import { createGlobalState } from 'react-global-state-hooks/createGlobalState';`}</pre>
          <br />
          <pre className="text-xs text-green-800">{`// It works like useState, but it's global`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`const useCounter = createGlobalState(0);`}</pre>
          <br />
        </CodeBlock>
      </Container>

      <Container className="flex flex-col gap-4">
        <SubTitle className="col-span-2">How to share a global state?</SubTitle>

        <CodeBlock>
          <pre className="text-xs">{`const ComponentA = () => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  const [count, setCount] = useCounter();`}</pre>
          <br />
          <pre className="text-xs">{`  return <button onClick={() => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`    setCount((prev) => prev + 1);`}</pre>
          <pre className="text-xs">{`  }}>Increment</button>;`}</pre>
          <pre className="text-xs">{`}; `}</pre>
        </CodeBlock>

        <CodeBlock>
          <pre className="text-xs">{`const ComponentB = () => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  const [count, setCount] = useCounter();`}</pre>
          <br />
          <pre className="text-xs">{`  return <button onClick={() => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`    setCount((prev) => prev - 1);`}</pre>
          <pre className="text-xs">{`  }}>Decrement</button>;`}</pre>
          <pre className="text-xs">{`}; `}</pre>
        </CodeBlock>
      </Container>
    </>
  );
})();

const objectStateExample = (() => {
  const useContacts = createGlobalState(getContactsMock());

  const ComponentA = () => {
    const [filter, setFilter] = useState('');

    const [contactsLength] = useContacts((contacts) => contacts.size, []);
    const [filteredContacts] = useContacts(
      (contacts) => {
        return [...contacts.values()].filter((contact) =>
          contact.name.toLowerCase().includes(filter.toLowerCase())
        );
      },
      [filter]
    );

    return (
      <Container
        className="grid grid-cols-[auto,1fr] gap-2 gap-x-6 auto-rows-min items-start"
        style={{ gridColumnStart: 'auto 1fr', minHeight: `${contactsLength * 3.2}rem` }}
      >
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Search..."
            className="text-xs w-full border-emphasis-primary border rounded-md p-2"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {filteredContacts.map((contact) => (
          <React.Fragment key={contact.id}>
            <label>{contact.name}</label>
            <label>{contact.email}</label>
            <hr className="col-span-2 border-emphasis-primary border" />
          </React.Fragment>
        ))}

        {filteredContacts.length === 0 && (
          <label className="col-span-2 text-gray-400">No contacts found</label>
        )}
      </Container>
    );
  };

  return (
    <>
      <Container className="flex flex-col gap-4">
        <SubTitle className="">Select only what you need</SubTitle>
        <ComponentA />
      </Container>

      <Container className="flex flex-col gap-4">
        <SubTitle className="">How does it look like?</SubTitle>

        <CodeBlock>
          <pre className="text-xs">{`const ContactList = () => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  const [filter, setFilter] = useState('');`}</pre>
          <br />
          <pre className="text-xs text-emphasis-primary">{`  // You can use selectors to get only what you need`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  const [filteredContacts] = useContacts(`}</pre>
          <pre className="text-xs">{`    (contacts) => {`}</pre>
          <pre className="text-xs">{`      return [...contacts.values()].filter((contact) => {`}</pre>
          <pre className="text-xs">{`        const filter = filter.toLowerCase();`}</pre>
          <pre className="text-xs">{`        const name = contact.name.toLowerCase();`}</pre>
          <br />
          <pre className="text-xs">{`        return name.includes(filter);`}</pre>
          <pre className="text-xs">{`      });`}</pre>
          <pre className="text-xs">{`    },`}</pre>
          <pre className="text-xs text-emphasis-primary">{`    // You can pass an array of dependencies`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`    [filter]`}</pre>
          <pre className="text-xs">{`  );`}</pre>
          <br />
          <pre className="text-xs">{`  return filteredContacts.map(...`}</pre>
          <pre className="text-xs">{`};`}</pre>
        </CodeBlock>

        <ul className="text-xs pl-4">
          <li className="list-disc">The selector will recompute if the state changes</li>
          <li className="list-disc">The selector will also recompute if the dependencies change</li>
        </ul>

        <label className="text-xs">
          Optionally, you can also configure the isEqualRoot if you need specific comparison logic.
        </label>
        <CodeBlock>
          <pre className="text-xs">{`const useContacts = createGlobalState(getContactsMock(), {`}</pre>
          <pre className="text-xs">{`  ...`}</pre>
          <pre className="text-xs">{`},`}</pre>
          <pre className="text-xs">{`{`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  isEqualRoot: (a, b) => a.size === b.size,`}</pre>
          <pre className="text-xs">{`  dependencies: [filter],`}</pre>
          <pre className="text-xs">{`});`}</pre>
        </CodeBlock>
      </Container>
    </>
  );
})();

export const GlobalHooksExample = () => {
  return (
    <div className={merge(styles.bgDots, 'text-text-normal', 'flex flex-col gap-4', 'p-4 md:px-20')}>
      <Title>Welcome to react-hooks-global-state</Title>

      <div
        className={merge(
          'min-h-screen w-full lg:w-2/3 flex flex-col md:grid grid-cols-1 md:grid-cols-2 gap-6',
          'auto-rows-min',
          'align-middle place-content-start'
        )}
      >
        <hr className="col-span-2 border-emphasis-secondary border" />

        {simpleCounterExample}

        <hr className="col-span-2 border-emphasis-secondary border" />

        {objectStateExample}
      </div>
    </div>
  );
};

type Contact = {
  id: string;
  name: string;
  email: string;
};

function getContactsMock() {
  return new Map<string, Contact>([
    ['1', { id: '1', name: 'John Doe', email: 'johndoe@example.com' }],
    ['2', { id: '2', name: 'Jane Smith', email: 'janesmith@example.com' }],
    ['3', { id: '3', name: 'Alice Johnson', email: 'alicej@example.com' }],
    ['4', { id: '4', name: 'Bob Brown', email: 'bobbrown@example.com' }],
    ['5', { id: '5', name: 'Charlie Davis', email: 'charlied@example.com' }],
    ['6', { id: '6', name: 'Diana Evans', email: 'dianaevans@example.com' }],
    ['7', { id: '7', name: 'Ethan Wright', email: 'ethanw@example.com' }],
    ['8', { id: '8', name: 'Fiona Green', email: 'fionag@example.com' }],
    ['9', { id: '9', name: 'George Harris', email: 'georgeh@example.com' }],
    ['10', { id: '10', name: 'Hannah Lee', email: 'hannahlee@example.com' }],
  ]);
}
