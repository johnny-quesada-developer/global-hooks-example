import React, { useEffect, useRef, useState, useTransition } from 'react';
import merge from 'easy-css-merge';
import styles from './GlobalHooksExample.module.scss';
import createGlobalState from 'react-global-state-hooks/createGlobalState';
import { uniqueId } from 'react-global-state-hooks/uniqueId';
import { createPortal } from 'react-dom';
import isFunction from 'json-storage-formatter/isFunction';
import isNil from 'json-storage-formatter/isNil';
import { createContext } from 'react-global-state-hooks/createContext';

//  * Start simple: use global state just like useState
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
        <SubTitle className="col-span-2" section="how-to-create-a-global-state">
          How to create a global state?
        </SubTitle>

        <ComponentA />
        <ComponentB />

        <CodeBlock className="col-span-2">
          <pre className="text-xs">{`import createGlobalState from 'react-global-state-hooks/createGlobalState';`}</pre>
          <br />
          <pre className="text-xs text-green-800">{`// It works like useState, but it's global`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`const useCounter = createGlobalState(0);`}</pre>
        </CodeBlock>
      </Container>

      <Container className="flex flex-col gap-4">
        <SubTitle className="col-span-2" section="how-to-share-a-global-state">
          How to share a global state?
        </SubTitle>

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
  // contacts => Map<string, {id: string; name: string; email: string}>
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
        style={{
          gridColumnStart: 'auto 1fr',
          minHeight: `${contactsLength * 3.2}rem`,
        }}
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
        <SubTitle section="select-only-what-you-need">Select only what you need</SubTitle>
        <ComponentA />
      </Container>

      <Container className="flex flex-col gap-4">
        <SubTitle>How does it look like?</SubTitle>

        <CodeBlock>
          <pre className="text-xs">{`const ContactList = () => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  const [filter, setFilter] = useState('');`}</pre>
          <br />
          <pre className="text-xs text-emphasis-primary">{`  // You can use selectors to get only what you need`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  const [filteredContacts] = useContacts(`}</pre>
          <pre className="text-xs">{`    (state) => {`}</pre>
          <pre className="text-xs">{`      return [...state.contacts.values()].filter((contact) => {`}</pre>
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
          <li className="list-disc">
            The selector will also recompute if the dependencies change
          </li>
        </ul>

        <label className="text-xs">
          Optionally, you can also configure the <strong>isEqualRoot</strong> or{' '}
          <strong>isEqual</strong> if you need specific comparison logic.
        </label>
        <CodeBlock>
          <pre className="text-xs">{`const useContacts = createGlobalState({ contacts: getContactsMock(), ... });`}</pre>
          ...
          <br />
          <br />
          <pre className="text-xs text-emphasis-interactive">{`const [filteredContacts] = useContacts(`}</pre>
          <pre className="text-xs">{`  (state) => {`}</pre>
          <pre className="text-xs">{`    return [...state.contacts.values()].filter((contact) => {`}</pre>
          <pre className="text-xs">{`      return contact.name.toLowerCase().includes(filter);`}</pre>
          <pre className="text-xs">{`    });`}</pre>
          <pre className="text-xs">{`  },`}</pre>
          <pre className="text-xs">{`  {`}</pre>
          <pre className="text-xs text-emphasis-primary">{`    // This prevents re-computing the selector if contacts didn't change`}</pre>
          <pre className="text-xs text-emphasis-primary">{`    // The selector still will be re-computed if the dependencies change`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`    isEqualRoot: (a, b) => a.contacts === b.contacts,`}</pre>
          <pre className="text-xs">{`    dependencies: [filter],`}</pre>
          <pre className="text-xs">{`  }`}</pre>
          <pre className="text-xs">{`);`}</pre>
        </CodeBlock>
      </Container>
    </>
  );
})();

const reusingSelectorsExample = (() => {
  const useContacts = createGlobalState(getContactsMock());

  const useContactsArray = useContacts.createSelectorHook((contacts) => {
    return [...contacts.values()];
  });

  const useContactsWithJ = useContactsArray.createSelectorHook((contacts) => {
    return contacts.filter((contact) => {
      const name = contact.name.toLowerCase();
      return name.startsWith('j');
    });
  });

  const ComponentA = () => {
    const contacts = useContactsWithJ();

    return (
      <Container
        className="grid grid-cols-[auto,1fr] gap-2 gap-x-6 auto-rows-min items-start"
        style={{ gridColumnStart: 'auto 1fr' }}
      >
        {contacts.map((contact) => (
          <React.Fragment key={contact.id}>
            <label>{contact.name}</label>
            <label>{contact.email}</label>
            <hr className="col-span-2 border-emphasis-primary border" />
          </React.Fragment>
        ))}
      </Container>
    );
  };

  return (
    <>
      <Container className="flex flex-col gap-4">
        <SubTitle section="create-reusable-selected-states">
          Create reusable selector
        </SubTitle>

        <CodeBlock>
          <pre className="text-xs text-emphasis-interactive">{`const useContactsArray = useContacts.createSelectorHook(({ contacts, ... }) => {`}</pre>
          <pre className="text-xs">{`  return [...contacts.values()];`}</pre>
          <pre className="text-xs">{`}, {
  isEqual: (a, b) => a.contacts === b.contacts,
});`}</pre>
          <br />
          <pre className="text-xs text-emphasis-primary">{`// You can create a selector from another selector`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`const useContactsWithJ = useContactsArray.createSelectorHook((contacts) => {`}</pre>
          <pre className="text-xs">{`  return contacts.filter((contactsArray) => {`}</pre>
          <pre className="text-xs">{`    const name = contactsArray.name.toLowerCase();`}</pre>
          <pre className="text-xs">{`    return name.startsWith('j');`}</pre>
          <pre className="text-xs">{`  });`}</pre>
          <pre className="text-xs">{`});`}</pre>
        </CodeBlock>

        <p className="text-xs">
          Each selector listens only to the state of the hook it was created from.
        </p>
      </Container>

      <Container className="flex flex-col gap-4">
        <SubTitle>Contacts whose names start with 'J'</SubTitle>
        <ComponentA />

        <CodeBlock>
          <pre className="text-xs">{`const ComponentA = () => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  const contacts = useContactsWithJ();`}</pre>
          <br />
          <pre className="text-xs">{`  ...contacts.map(...`}</pre>
          <pre className="text-xs">{`};`}</pre>
        </CodeBlock>
      </Container>
    </>
  );
})();

const listeningToStateChanges = (() => {
  const progress$ = createGlobalState({ progress: 25, isRunning: false });

  const useProgress = progress$.createSelectorHook((state) => state.progress);

  // doesn't listen to changes, just retrieve the state value or subscribe to changes
  const ComponentA = () => {
    const isRunning = progress$.use.select((state) => state.isRunning);

    console.log('listeningToStateChanges ComponentA rendered', { isRunning });

    useEffect(() => {
      if (!isRunning) return;

      const interval = setInterval(() => {
        progress$.setState((prev) => ({
          ...prev,
          progress: (prev.progress + 1) % 101,
        }));
      }, 50);

      return () => clearInterval(interval);
    }, [isRunning]);

    return (
      <Container
        className="flex justify-between items-center flex-wrap"
        style={{ gridColumnStart: 'auto 1fr' }}
      >
        <ProgressLabel />
        <Button
          onClick={() =>
            progress$.setState((prev) => ({ ...prev, isRunning: !prev.isRunning }))
          }
        >
          {isRunning ? 'Pause' : 'Resume'}
        </Button>
      </Container>
    );
  };

  function ProgressLabel() {
    return <label>Progress: {useProgress()}%</label>;
  }

  const ComponentB = () => {
    const ref = useRef<HTMLProgressElement>(null);

    useEffect(() => {
      const progressElement = ref.current!;

      // returns a function to unsubscribe
      return progress$.subscribe(({ progress }) => {
        progressElement.value = progress;
      });
    }, []);

    return (
      <Container className="grid grid-cols-2 gap-6 auto-rows-min items-start">
        <label className="col-span-2">Progress</label>

        <progress
          ref={ref}
          value={0}
          max={100}
          className={merge(
            'col-span-2 w-full h-4 appearance-none border-emphasis-primary border rounded-md overflow-hidden',
            'bg-white [&::-webkit-progress-bar]:bg-white',
            '[&::-webkit-progress-value]:bg-emphasis-interactive [&::-moz-progress-bar]:bg-emphasis-interactive'
          )}
        />

        <CodeBlock className="col-span-2">
          <pre className="text-xs text-emphasis-primary">{`// This component gets the state through subscription instead of a hook`}</pre>
          <pre className="text-xs">{`const ref = useRef<HTMLProgressElement>(null);`}</pre>
          <br />
          <pre className="text-xs">{`useEffect(() => {`}</pre>
          <pre className="text-xs">{`  const progressElement = ref.current!;`}</pre>
          <br />
          <pre className="text-xs text-emphasis-primary">{`  // returns a function to unsubscribe`}</pre>
          <pre className="text-xs text-emphasis-primary">{`  // listen only the progress value changes`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  return progress$.subscribe(({ progress }) => progress, (progress) => {`}</pre>
          <pre className="text-xs">{`    progressElement.value = progress;`}</pre>
          <pre className="text-xs">{`  });`}</pre>
          <pre className="text-xs">{`}, []);`}</pre>
          <br />
          <pre className="text-xs">{`return <progress ref={ref} value={0} max={100} />;`}</pre>
        </CodeBlock>

        <SubTitle
          className="col-span-2"
          section="retrieve-state-value-without-subscribing"
        >
          Retrieve state value without subscribing
        </SubTitle>

        <label className="text-xs col-span-2">
          You can also simple retrieve the state value without subscribing to changes
        </label>

        <CodeBlock className="col-span-2">
          <pre className="text-xs text-emphasis-primary">{`// synchronously returns the current value of the state (no re-render needed)`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`console.log('Current progress:', progress$.getState().progress);`}</pre>
        </CodeBlock>
      </Container>
    );
  };

  return (
    <>
      <Container className="flex flex-col gap-4">
        <SubTitle section="retrieve-hook-controls-outside-of-components">
          Control state without hooks
        </SubTitle>

        <CodeBlock>
          <pre className="text-xs text-emphasis-primary">{`// Let's use more store like syntax for this example`}</pre>
          <pre className="text-xs">{`const progress$ = createGlobalState({ progress: 0, isRunning: false });`}</pre>
          <br />
          <pre className="text-xs">{`const useProgress = progress$.createSelectorHook((state) => state.progress);`}</pre>
          <br />
          <pre className="text-xs">{`const ComponentA = () => {`}</pre>
          <pre className="text-xs text-emphasis-primary">{`  // We support this sugar for better semantic and readability`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  const isRunning = progress$.use.select((state) => state.isRunning);`}</pre>
          <br />
          <pre className="text-xs">{`  useEffect(() => {`}</pre>
          <pre className="text-xs">{`    if (!isRunning) return;`}</pre>
          <br />
          <pre className="text-xs">{`    const interval = setInterval(() => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`      progress$.setState((prev) => ({`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`        ...prev,`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`        progress: (prev.progress + 1) % 101`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`      }));`}</pre>
          <pre className="text-xs">{`    }, 1000);`}</pre>
          <br />
          <pre className="text-xs">{`    return () => clearInterval(interval);`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  }, [isRunning]);`}</pre>
          <br />
          <pre className="text-xs">{`...`}</pre>
          <pre className="text-xs">{`};`}</pre>
          <br />
          <pre className="text-xs text-emphasis-primary">{`// will re-render when the progress changes`}</pre>
          <pre className="text-xs">{`const ProgressLabel = () => {`}</pre>
          <pre className="text-xs text-emphasis-interactive">{`  return <label>Progress: {useProgress()}%</label>;`}</pre>
          <pre className="text-xs">{`};`}</pre>
        </CodeBlock>

        <ComponentA />
      </Container>

      <Container className="flex flex-col gap-4">
        <SubTitle section="subscribe-to-state-changes-without-a-hooks">
          Subscribe to state changes without hooks
        </SubTitle>
        <ComponentB />
      </Container>
    </>
  );
})();

const moreListeningToStateChanges = (() => {
  const contacts$ = createGlobalState(getContactsMock());

  const useContactsArray = contacts$.createSelectorHook((contacts) => {
    return [...contacts.values()];
  });

  const initialSelectedContactId = null as string | null;

  const useSelectedContactId = createGlobalState(initialSelectedContactId, {
    callbacks: {
      onInit: ({ setState, getState }) => {
        contacts$.subscribe((contacts) => {
          if (contacts.has(getState()!)) return;

          setState(null);
        });
      },
    },
  });

  const ComponentA = () => {
    const contacts = useContactsArray();
    const [selectedContactId, setSelectedContactId] = useSelectedContactId();

    return (
      <ul className="border border-emphasis-primary rounded-md">
        {contacts.map((contact, index) => (
          <li
            key={contact.id}
            className={merge(
              'cursor-pointer bg-opacity-10',
              {
                'bg-emphasis-primary': index % 2 === 0,
                'bg-emphasis-secondary': index % 2 !== 0,
                '!bg-emphasis-primary !opacity-100 text-white':
                  selectedContactId === contact.id,
              },
              'hover:bg-opacity-50 hover:text-white hover:bg-emphasis-primary'
            )}
          >
            <button
              className="inset-0 w-full h-full p-2"
              onClick={() => {
                setSelectedContactId(contact.id);
              }}
            >
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const ComponentB = () => {
    const [selectedContactId] = useSelectedContactId();

    return (
      <Container
        className="flex gap-4 items-center flex-wrap"
        style={{ gridColumnStart: 'auto 1fr' }}
      >
        <label>
          <strong>Selected contact Id</strong>: {selectedContactId ?? 'None'}
        </label>

        <Button
          onClick={() => {
            if (!selectedContactId) return;

            contacts$.setState((contacts) => {
              contacts.delete(selectedContactId);
              return new Map(contacts);
            });
          }}
        >
          Delete Selected Contact
        </Button>

        <Button
          onClick={() => {
            contacts$.setState(getContactsMock());
          }}
        >
          Reset Example
        </Button>
      </Container>
    );
  };

  return (
    <Container className="grid grid-cols-2 gap-4 gap-x-6 auto-rows-min items-start">
      <SubTitle className="col-span-2" section="hooks-who-depend-other-hooks">
        Hooks who depend other hooks
      </SubTitle>

      <label className="col-span-2">
        Been able to listen to the state changes without a hook is very useful, let's say
        that you have and state that depends on another one.
      </label>

      <label className="font-semibold">Component A</label>
      <label className="font-semibold">Component B</label>

      <ComponentA />
      <ComponentB />

      <label className="col-span-2 font-bold">useContacts</label>
      <CodeBlock className="col-span-2">
        <pre className="text-xs">{`const useContacts = createGlobalState(getContactsMock());`}</pre>
        <br />

        <pre className="text-xs">{`const useContactsArray = useContacts.createSelectorHook((contacts) => {`}</pre>
        <pre className="text-xs">{`  return [...contacts.values()];`}</pre>
        <pre className="text-xs">{`});`}</pre>
      </CodeBlock>

      <label className="col-span-2 font-bold">useSelectedContact</label>

      <CodeBlock className="col-span-2">
        <pre className="text-xs">{`const initialValue: string | null = null`}</pre>
        <br />
        <pre className="text-xs text-emphasis-primary">{`// The second argument is a configuration object, we'll analyze it from now on`}</pre>
        <pre className="text-xs">{`const useSelectedContactId = createGlobalState(initialValue, {`}</pre>
        <pre className="text-xs text-emphasis-primary">{`  // lifecycle events of the state`}</pre>
        <pre className="text-xs text-emphasis-interactive">{`  callbacks: {`}</pre>
        <pre className="text-xs text-emphasis-interactive">{`    onInit: ({ setState, getState }) => {`}</pre>
        <pre className="text-xs text-emphasis-primary font-semibold">{`      // If the contacts map stops containing the selected one, reset`}</pre>
        <pre className="text-xs text-emphasis-interactive">{`      contacts$.subscribe((contacts) => {`}</pre>
        <pre className="text-xs">{`        if (contacts.has(getState()!)) return;`}</pre>
        <br />
        <pre className="text-xs">{`        setState(null);`}</pre>
        <pre className="text-xs">{`      });`}</pre>
        <pre className="text-xs">{`    },`}</pre>
        <pre className="text-xs">{`  },`}</pre>
        <pre className="text-xs">{`});`}</pre>
      </CodeBlock>

      <p className="col-span-2">
        All the logic related to the state is contained into the hook declaration
      </p>
    </Container>
  );
})();

const persistStateExample = (() => {
  const useCounter = createGlobalState(0, {
    localStorage: {
      key: '_counter_from_react_hooks_global_states_example',
      validator: ({ restored }) => {
        if (typeof restored !== 'number')
          throw new Error('Invalid value, expected a number');
      },
    },
  });

  const useCounterWithActions = createGlobalState(0, {
    actions: {
      // the first function defines the action name and arguments
      increment: (value = 1) => {
        // the return of the second function is the action itself
        // and defines the return type of the action
        return ({ setState, getState }) => {
          setState((prev) => prev + value);

          return getState();
        };
      },

      decrement: (value = 1) => {
        return ({ setState }) => {
          setState((prev) => prev - value);
        };
      },
    },
  });

  const ComponentA = () => {
    const [count, setCount] = useCounter();

    return (
      <Container
        className="flex gap-4 items-center flex-wrap"
        style={{ gridColumnStart: 'auto 1fr' }}
      >
        <Button onClick={() => setCount((prev) => prev + 1)}>Increment</Button>
        <Button onClick={() => setCount((prev) => prev - 1)}>Decrement</Button>
        <label className="flex-1 text-right">{count}</label>
      </Container>
    );
  };

  const ComponentB = () => {
    const [count, { increment, decrement }] = useCounterWithActions();

    return (
      <Container
        className="flex gap-4 items-center flex-wrap"
        style={{ gridColumnStart: 'auto 1fr' }}
      >
        <Button onClick={() => increment(2)}>Increment</Button>
        <Button onClick={() => decrement(2)}>Decrement</Button>
        <label className="flex-1 text-right">{count}</label>
      </Container>
    );
  };

  return (
    <Container className="flex flex-col gap-4">
      <SubTitle section="persist-state-in-localstorage">
        Persist state in localStorage
      </SubTitle>

      <p>
        If you are using{' '}
        <a
          className="text-emphasis-interactive hover:underline"
          href="https://www.npmjs.com/package/react-global-state-hooks"
        >
          react-global-state-hooks
        </a>
        , which is the version of the library focused on browser usage, you can persist
        the state in the localStorage.
      </p>

      <ComponentA />

      <CodeBlock>
        <pre className="text-xs">{`const useCounter = createGlobalState(0, {`}</pre>
        <pre className="text-xs">{`  localStorage: {`}</pre>
        <pre className="text-xs text-emphasis-interactive">{`    key: '_counter_from_react_hooks_global_states_example',`}</pre>
        <pre className="text-xs">{`    validator: ({ restored }) => {`}</pre>
        <pre className="text-xs">{`      if (typeof restored !== 'number') throw new Error('Invalid value, expected a number');`}</pre>
        <pre className="text-xs">{`    },`}</pre>
        <pre className="text-xs">{`  },`}</pre>
        <pre className="text-xs">{`});`}</pre>
      </CodeBlock>
      <ul className="pl-8 text-s">
        <li className="list-disc">
          The validator function is required to ensure the integrity of the data being
          restored from localStorage.
        </li>
        <li className="list-disc">
          If the validator throws an error, the state will be reset to the initial value.
        </li>
        <li className="list-disc">
          If the validator returns a value it will override the restored one.
        </li>
        <li className="list-disc">
          The validator function receives <strong>{`{ restored, initial }`}</strong> as
          argument.
        </li>
        <li className="list-disc">
          The validator function could be empty <strong>{`validator: () => {}`}</strong>
        </li>
      </ul>

      <SubTitle section="custom-actions">Custom actions</SubTitle>
      <p>
        You can also restrict the manipulation of the state to and specific set of
        actions.
      </p>

      <CodeBlock className="col-span-2">
        <pre className="text-xs">{`const useCounterWithActions = createGlobalState(0, {`}</pre>
        <pre className="text-xs text-emphasis-interactive">{`  actions: {`}</pre>
        <pre className="text-xs  text-emphasis-interactive">{`    increment: (value = 1) => {`}</pre>
        <pre className="text-xs  text-emphasis-interactive">{`      return ({ setState, getState }) => {`}</pre>
        <pre className="text-xs">{`        setState((prev) => prev + value);`}</pre>
        <br />
        <pre className="text-xs">{`        return getState();`}</pre>
        <pre className="text-xs">{`      };`}</pre>
        <pre className="text-xs">{`    },`}</pre>
        <br />
        <pre className="text-xs text-emphasis-interactive">{`    decrement: (value = 1) => {`}</pre>
        <pre className="text-xs text-emphasis-interactive">{`      return ({ setState }) => {`}</pre>
        <pre className="text-xs">{`        setState((prev) => prev - value);`}</pre>
        <br />
        <pre className="text-xs">{`        return getState();`}</pre>
        <pre className="text-xs">{`      };`}</pre>
        <pre className="text-xs">{`    },`}</pre>
        <pre className="text-xs">{`  },`}</pre>
        <pre className="text-xs">{`});`}</pre>
        <br />
        <pre className="text-xs text-emphasis-primary">{`// You can also use store like syntax`}</pre>
        <pre className="text-xs">{`const counter$ = createGlobalState(0, {...});`}</pre>
      </CodeBlock>

      <label className="font-semibold">How to use the actions</label>
      <CodeBlock>
        <pre className="text-xs text-emphasis-primary">{`// Now instead of a setter, you have an object with the actions`}</pre>
        <pre className="text-xs text-emphasis-primary">{`// the actions object and keys are memoized and won't change`}</pre>
        <pre className="text-xs">{`const [count, { increment, decrement }] = useCounterWithActions();`}</pre>
        <br />
        <pre className="text-xs text-emphasis-primary">{`// Increase the count by himself each time: 1, 2, 4, 8, 16, ...`}</pre>
        <pre className="text-xs">
          {`<Button onClick={`}
          <span className="text-emphasis-interactive">{'() => increment(2)'}</span>
          {`}>Increment</Button>`}
        </pre>
        <pre className="text-xs">
          {`<Button onClick={`}
          <span className="text-emphasis-interactive">{'() => decrement(2)'}</span>
          {`}>Decrement</Button>`}
        </pre>
        <br />
        <pre className="text-xs text-emphasis-primary">{`// Or with store like syntax`}</pre>
        <pre className="text-xs">
          {`<Button onClick={`}
          <span className="text-emphasis-interactive">
            {'() => counter$.actions.increment(2)'}
          </span>
          {`}>Increment</Button>`}
        </pre>
        <pre className="text-xs">
          {`<Button onClick={`}
          <span className="text-emphasis-interactive">
            {'() => counter$.actions.decrement(2)'}
          </span>
          {`}>Decrement</Button>`}
        </pre>
      </CodeBlock>
      <ComponentB />
    </Container>
  );
})();

const menuTransitionStyle = {
  viewTransitionName: 'floating-menu',
} as React.CSSProperties;

const menu$ = createContext(
  {
    isOpen: false,
  },
  {
    actions: {
      openMenu: () => {
        return ({ setState }) => {
          setState({ isOpen: true });
        };
      },
      closeMenu: () => {
        return ({ setState }) => {
          setState({ isOpen: false });
        };
      },
    },
  }
);

const MenuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = () => {
  const [, transition] = useTransition();
  const [, { openMenu }] = menu$.use();

  return (
    <button
      style={menuTransitionStyle}
      className={merge(
        'z-20 rounded-2xl shadow-lg',
        'w-10 h-10 flex justify-center items-center',
        'bg-background-primary border-emphasis-primary border rounded-tl-md',
        'hover:bg-emphasis-primary hover:text-background-primary',
        'transition-colors duration-300',
        'animate-[fade-in_0.3s_linear]'
      )}
      onClick={() =>
        transition(() => {
          openMenu();
        })
      }
    >
      ☰
    </button>
  );
};

const FloatingMenuContainer: React.FC = () => {
  const [, transition] = useTransition();
  const [{ isOpen: isMenuOpen }, { closeMenu }] = menu$.use();

  useClickOutSide(() => {
    transition(() => {
      closeMenu();
    });
  }, [
    isMenuOpen,
    () => document.getElementById('floating-menu')!,
    closeMenu,
    transition,
  ]);

  return (
    <div className="fixed top-2 left-2">
      {!isMenuOpen && <MenuButton />}

      {isMenuOpen && (
        <ul
          style={menuTransitionStyle}
          className={merge(
            'bg-background-primary rounded-md',
            'border border-emphasis-primary',
            'will-change-auto animate-[clip-down_0.3s_linear]',
            'shadow-lg'
          )}
        >
          <li className="px-4 py-2 text-text-title font-semibold">Examples</li>
          <hr className="border-emphasis-primary border border-opacity-20 last-of-type:hidden" />

          {[
            ['how-to-create-a-global-state', 'How to create a global state?'],
            ['how-to-share-a-global-state', 'How to share a global state?'],
            ['select-only-what-you-need', 'Select only what you need'],
            ['create-reusable-selected-states', 'Create reusable selected states'],
            [
              'retrieve-hook-controls-outside-of-components',
              'Retrieve hook controls outside of components',
            ],
            [
              'subscribe-to-state-changes-without-a-hooks',
              'Subscribe to state changes without a hooks',
            ],
            ['hooks-who-depend-other-hooks', 'Hooks who depend other hooks'],
            ['persist-state-in-localstorage', 'Persist state in localStorage'],
            ['custom-actions', 'Custom actions'],
          ].map(([section, displayName]) => (
            <React.Fragment key={section}>
              <li className="px-4 py-2">
                <a
                  href={`#${section}`}
                  onClick={() => {
                    transition(() => {
                      closeMenu();
                      document
                        .getElementById(section)
                        ?.scrollIntoView({ behavior: 'smooth' });
                    });
                  }}
                  className="block text-sm text-emphasis-primary hover:text-emphasis-secondary"
                >
                  〉{displayName}
                </a>
              </li>

              <hr className="border-emphasis-primary border border-opacity-20 last-of-type:hidden" />
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

const MenuPortal: React.FC<React.PropsWithChildren> = ({ children }) => {
  return createPortal(children, document.getElementById('floating-menu')!);
};

export const GlobalHooksExample = () => {
  return (
    <div
      className={merge(
        styles.bgDots,
        'text-text-normal',
        'flex flex-col gap-4',
        'p-4 pb-96 md:px-20'
      )}
    >
      <MenuPortal>
        <menu$.Provider>
          <FloatingMenuContainer />
        </menu$.Provider>
      </MenuPortal>

      <Title>Welcome to react-hooks-global-state</Title>

      <div
        className={merge(
          'min-h-screen w-full flex flex-col md:grid grid-cols-1 md:grid-cols-2 gap-6',
          'auto-rows-min',
          'align-middle place-content-start'
        )}
      >
        <hr
          id="simpleCounterExample"
          className="col-span-2 border-emphasis-secondary border"
        />
        {simpleCounterExample}

        <hr
          id="objectStateExample"
          className="col-span-2 border-emphasis-secondary border"
        />
        {objectStateExample}

        <hr
          id="reusingSelectorsExample"
          className="col-span-2 border-emphasis-secondary border"
        />
        {reusingSelectorsExample}

        <hr
          id="listeningToStateChanges"
          className="col-span-2 border-emphasis-secondary border"
        />
        {listeningToStateChanges}

        <hr
          id="moreListeningToStateChanges"
          className="col-span-2 border-emphasis-secondary border"
        />
        {moreListeningToStateChanges}
        {persistStateExample}

        <Container
          className={merge(
            'col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:place-items-center gap-4'
          )}
        >
          <SubTitle className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-left w-full">
            createContext
          </SubTitle>

          <snake-game apples={10}></snake-game>
          <snake-game apples={10}></snake-game>
          <snake-game apples={10}></snake-game>
          <snake-game apples={10}></snake-game>
        </Container>
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
  return new Map<string, Contact>(
    [
      { id: uniqueId('c:'), name: 'John Doe', email: 'johndoe@example.com' },
      {
        id: uniqueId('c:'),
        name: 'Jane Smith',
        email: 'janesmith@example.com',
      },
      {
        id: uniqueId('c:'),
        name: 'Alice Johnson',
        email: 'alicej@example.com',
      },
      { id: uniqueId('c:'), name: 'Bob Brown', email: 'bobbrown@example.com' },
      {
        id: uniqueId('c:'),
        name: 'Charlie Davis',
        email: 'charlied@example.com',
      },
      {
        id: uniqueId('c:'),
        name: 'Diana Evans',
        email: 'dianaevans@example.com',
      },
      { id: uniqueId('c:'), name: 'Ethan Wright', email: 'ethanw@example.com' },
      { id: uniqueId('c:'), name: 'Fiona Green', email: 'fionag@example.com' },
      {
        id: uniqueId('c:'),
        name: 'George Harris',
        email: 'georgeh@example.com',
      },
      { id: uniqueId('c:'), name: 'Hannah Lee', email: 'hannahlee@example.com' },
    ].map((contact) => [contact.id, contact])
  );
}

function Title({
  className = '',
  children,
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <h1 className={merge(className, 'text-2xl font-bold text-text-title')}>{children}</h1>
  );
}

function SubTitle({
  className = '',
  section,
  children,
}: React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement> & {
    section?: string;
  }
>) {
  return (
    <h2
      id={section ?? uniqueId('section:')}
      className={merge(className, 'text-xl font-semibold text-text-subtitle')}
    >
      {children}
    </h2>
  );
}

function Container({
  className = '',
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
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
}

function Button({
  className = '',
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
}

function CodeBlock({
  className = '',
  children,
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
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
}

// no needed for CODEPEN

const useClickOutSide = (
  callback: (htmlElement: HTMLElement) => void,
  [isEnable, element, ...dependencies]: [
    isEnable: boolean,
    element: React.RefObject<HTMLElement> | (() => HTMLElement),
    ...dependencies: unknown[]
  ]
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    if (!isEnable) return;

    const target = isFunction(element) ? element() : element.current;
    if (isNil(target)) return;

    const root = document.getElementById('root')!;
    const clickOutsideHandler = (event: MouseEvent) => {
      if (event.target === target || (event.target as HTMLElement).contains(target))
        return;
      callbackRef.current(target);
    };

    root.addEventListener('click', clickOutsideHandler);
    return () => root.removeEventListener('click', clickOutsideHandler);
  }, [isEnable, element, ...dependencies]);
};
