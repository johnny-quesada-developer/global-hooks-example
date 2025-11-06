import { createRoot } from 'react-dom/client';
import { SnakeGame } from './components/Game';
import { initialValue, SnakeContext } from './stores/snakeGame';
import { createDecoupledPromise } from 'easy-cancelable-promise';
import { isNil } from 'json-storage-formatter';
import debounce from './helpers/debounce';
import snakeGame from './stores/snakeGame';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'snake-game': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        matrix?: number;
        apples?: number;
        speed?: number;
        renders?: number;
      };
    }
  }
}

type StateKey = keyof typeof initialValue;

type AttrType = 'number' | 'boolean';

type Attr = {
  name: StateKey;
  value: unknown;
  defaultValue: unknown;
  type: AttrType;
};

export class SnakeElement extends HTMLElement {
  public static selector = 'snake-game';

  public static htmlAttrsMap: Map<string, Attr> = new Map([
    [
      'matrix',
      {
        name: 'matrixSize',
        value: 10,
        defaultValue: 10,
        type: 'number',
      },
    ],
    [
      'apples',
      {
        name: 'applesCount',
        value: 5,
        defaultValue: 5,
        type: 'number',
      },
    ],
    [
      'speed',
      {
        name: 'speedInterval',
        value: 200,
        defaultValue: 200,
        type: 'number',
      },
    ],
    [
      'renders',
      {
        name: 'showRenders',
        value: false,
        defaultValue: false,
        type: 'boolean',
      },
    ],
  ]);

  /**
   * Observe the attributes you care about updating
   */
  static get observedAttributes() {
    return Array.from(SnakeElement.htmlAttrsMap.keys());
  }

  public snakeGame: SnakeContext | null = null;

  private state = initialValue;

  constructor() {
    super();
  }

  async connectedCallback() {
    const defer = createDecoupledPromise<void>();

    const game = snakeGame.Provider.makeProviderWrapper({
      onCreated: () => defer.resolve(),
    });

    this.state = this.readParameters();

    createRoot(this).render(
      <game.wrapper value={this.state as typeof initialValue}>
        <SnakeGame />
      </game.wrapper>
    );

    await defer.promise;

    // captures the context api
    this.snakeGame = game.context.current;

    this.startGameDebounce();
  }

  startGameDebounce = debounce(() => {
    this.snakeGame?.actions.createMatrix(this.state);
  }, 10);

  readAttribute(htmlAttr: string): { name: string; value: unknown } | undefined {
    const { name, ...item } = SnakeElement.htmlAttrsMap.get(htmlAttr)!;
    let value: unknown = this.getAttribute(htmlAttr);

    if (isNil(value)) return;

    switch (item.type) {
      case 'boolean':
        value = !(value === 'false');
        break;
      default:
        value = Number(value);
        value = isNaN(value as number) ? item.defaultValue : value;
    }

    return { name, value };
  }

  readParameters() {
    return [...SnakeElement.htmlAttrsMap.entries()].reduce(
      (acc, [htmlAttr, item]) => {
        const result = this.readAttribute(htmlAttr);

        if (isNil(result)) return acc;

        acc[item.name] = result.value as never;

        return acc;
      },
      { ...this.state }
    );
  }

  disconnectedCallback() {
    this.snakeGame = null;
  }

  /**
   * Update the state of the component when attribute values change.
   */
  attributeChangedCallback(htmlAttr: string): { name: string; value: number } | void {
    const isKnowProp = SnakeElement.htmlAttrsMap.has(htmlAttr);
    if (!isKnowProp) return;

    this.state = this.readParameters();

    this.startGameDebounce();
  }
}

if (!customElements.get(SnakeElement.selector)) {
  customElements.define(SnakeElement.selector, SnakeElement);
}

export default SnakeElement;
