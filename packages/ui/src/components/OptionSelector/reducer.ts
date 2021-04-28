import { Coordinates, CssPosition, PositionType } from './types';

export type OptionSelectorState = {
  shouldRenderOptions: boolean;
  cssPosition: CssPosition;
  portalRoot?: HTMLDivElement;
  clickCoords?: Coordinates;
};

export type OptionSelectorActions =
  | { type: 'show'; payload: Coordinates }
  | { type: 'hide' }
  | {
    type: 'setCssPosition';
    payload: {
      position: PositionType;
      selectorRef: React.RefObject<HTMLDivElement>;
      optionsRef: React.RefObject<HTMLDivElement>;
    };
  };

const SELECTOR_SPACING = 4;
const OPTION_SELECTOR_PORTAL_ID = 'option-selector-portal';

export const initialState: OptionSelectorState = {
  shouldRenderOptions: false,
  cssPosition: {}
};

export function reducer (state: OptionSelectorState = initialState, action: OptionSelectorActions): OptionSelectorState {
  switch (action.type) {
    case 'show': {
      const root = document.getElementById('root');
      const createdPortalRoot = document.createElement('div');

      createdPortalRoot.id = OPTION_SELECTOR_PORTAL_ID;
      root?.appendChild(createdPortalRoot);

      return {
        ...state,
        shouldRenderOptions: true,
        clickCoords: action.payload,
        portalRoot: createdPortalRoot
      };
    }

    case 'hide': {
      state.portalRoot?.remove();

      return {
        ...initialState
      };
    }

    case 'setCssPosition': {
      const { clickCoords } = state;
      const { optionsRef, position, selectorRef } = action.payload;

      if (!selectorRef.current || !optionsRef.current || !clickCoords) return state;

      const selectorRect = selectorRef.current.getBoundingClientRect();
      const optionsRect = optionsRef.current.getBoundingClientRect();

      let cssPosition: CssPosition = {};

      switch (position) {
        case 'context': {
          let top = clickCoords.y;
          let left = clickCoords.x;

          // flip on x-axis
          if (clickCoords.x + optionsRect.width > document.body.clientWidth) {
            left = clickCoords.x - optionsRect.width;
          }

          // flip on y-axis
          if (clickCoords.y + optionsRect.height > document.body.clientHeight) {
            top = clickCoords.y - optionsRect.height;
          }

          cssPosition = {
            top,
            left
          };
          break;
        }

        case 'bottom-right':
          cssPosition = {
            top: selectorRect.bottom + SELECTOR_SPACING,
            left: selectorRect.left + selectorRect.width - optionsRect.width
          };
          break;

        case 'bottom-left':
          cssPosition = {
            top: selectorRect.bottom + SELECTOR_SPACING,
            left: selectorRect.left
          };
          break;
      }

      return {
        ...state,
        cssPosition
      };
    }

    default:
      return state;
  }
}
