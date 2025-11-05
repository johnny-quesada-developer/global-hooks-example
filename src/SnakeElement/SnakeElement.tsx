import { createRoot } from 'react-dom/client';
import { SnakeGame } from './components/Game';
import snakeGame, { initialValue, SnakeContext } from './stores/snakeGame';
import { createDecoupledPromise } from 'easy-cancelable-promise';
import { isNil } from 'json-storage-formatter';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'snake-game': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        matrix?: number;
        apples?: number;
        'interval-speed'?: number;
        'show-renders'?: number;
      };
    }
  }
}

export class SnakeElement extends HTMLElement {
  public static selector = 'snake-game';

  private static _propsMap: Map<string, string> = new Map([
    ['matrix', 'matrix'],
    ['apples', 'apples'],
    ['interval-speed', 'intervalSpeed'],
    ['show-renders', 'showRenders'],
  ]);

  /**
   * Observe the attributes you care about updating
   */
  static get observedAttributes() {
    return Array.from(SnakeElement._propsMap.keys());
  }

  constructor() {
    super();
  }

  private snakeGame: SnakeContext | null = null;

  async connectedCallback() {
    const defer = createDecoupledPromise<void>();

    const game = snakeGame.Provider.makeProviderWrapper({
      onCreated: () => defer.resolve(),
    });

    const matrixString = this.getAttribute('matrix');
    const applesString = this.getAttribute('apples');
    const intervalSpeedString = this.getAttribute('interval-speed');
    const showRendersString = this.getAttribute('show-renders');

    const parseNumber = ({ value, attr }: { attr: string | null; value: string | null }) => {
      if (!value) return undefined;

      const parsed = parseInt(value);
      return isNaN(parsed) ? {} : { [attr!]: parsed };
    };

    const value = {
      ...initialValue,
      ...parseNumber({ value: matrixString, attr: 'matrixSize' }),
      ...parseNumber({ value: applesString, attr: 'applesCount' }),
      ...parseNumber({ value: intervalSpeedString, attr: 'speedInterval' }),
      showRenders: isNil(showRendersString) ? initialValue.showRenders : Boolean(Number(showRendersString)),
    };

    createRoot(this).render(
      <game.wrapper value={value}>
        <SnakeGame />
      </game.wrapper>
    );

    await defer.promise;

    // captures the context api
    this.snakeGame = game.context.current;
  }

  disconnectedCallback() {
    this.snakeGame = null;
  }

  /**
   * Update the state of the component when attribute values change.
   */
  attributeChangedCallback(name: string, _oldValue: string, newValueString: string) {
    const isProp = SnakeElement._propsMap.has(name);

    if (!isProp || !this.snakeGame) return;

    const state = this.snakeGame.getState();

    const propName = SnakeElement._propsMap.get(name)!;
    const newValue = parseInt(newValueString ?? '0');
    const currentValue = state?.[propName as keyof typeof state];

    if (newValueString === undefined || newValue === currentValue) return;

    this.snakeGame.setState((prevProps) => ({
      ...prevProps,
      [propName]: newValue,
    }));
  }
}

if (!customElements.get(SnakeElement.selector)) {
  customElements.define(SnakeElement.selector, SnakeElement);
}

export default SnakeElement;
