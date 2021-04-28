import { memo } from 'react';

import { OptionSelector as OptionSelectorComponent } from './OptionSelector';

export const OptionSelector = memo(OptionSelectorComponent, () => true);
