import { createRoot } from 'react-dom/client';
import type { StateHook, StateSetter, BaseMetadata } from 'react-global-state-hooks';
import { Game } from './components/Game';
import { makeUseSnakeHtmlProps, SnakeHtmlProps } from './hooks/makeUseSnakeHtmlProps';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'snake-game': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        matrix?: number;
        'interval-speed'?: number;
      };
    }
  }
}

export class SnakeElement extends HTMLElement {
  public static selector = 'snake-game';

  private static _propsMap: Map<string, string> = new Map([
    ['matrix', 'matrix'],
    ['interval-speed', 'intervalSpeed'],
  ]);

  /**
   * Observe the attributes you care about updating
   */
  static get observedAttributes() {
    return Array.from(SnakeElement._propsMap.keys());
  }

  constructor() {
    super();

    this.useSnakeHtmlProps = makeUseSnakeHtmlProps();
  }

  private useSnakeHtmlProps: StateHook<SnakeHtmlProps, StateSetter<SnakeHtmlProps>, BaseMetadata>;

  connectedCallback() {
    createRoot(this).render(<Game useSnakeHtmlProps={this.useSnakeHtmlProps} />);
  }

  /**
   * Update the state of the component when attribute values change.
   */
  attributeChangedCallback(name: string, _oldValue: string, newValueString: string) {
    const isProp = SnakeElement._propsMap.has(name);

    if (!isProp) return;

    const [getProps, setProps] = this.useSnakeHtmlProps.stateControls();

    const propName = SnakeElement._propsMap.get(name) as keyof SnakeHtmlProps;
    const newValue = parseInt(newValueString ?? '0');
    const currentValue = getProps()[propName];

    if (newValueString === undefined || newValue === currentValue) return;

    setProps((prevProps) => ({
      ...prevProps,
      [propName]: newValue,
    }));
  }
}

customElements.define(SnakeElement.selector, SnakeElement);
