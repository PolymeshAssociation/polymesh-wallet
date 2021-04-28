import { memo } from 'react';

import { OptionSelector as OptionSelectorComponent } from './OptionSelector';

/**
 * OptionSelector needs to be memoized, since it can live within parents which are re-rendered often.
 * E.g. AccountView cards, which are re-rendered on mouse movements, hovers, etc.
 * Memoizing keeps OptionSelector from disappearing on parent re-renders.
 *
 * @TODO support dynamic props, if and when it is necessary
 */
export const OptionSelector = memo(OptionSelectorComponent, () => true);
