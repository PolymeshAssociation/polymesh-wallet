import React, { useCallback, useState } from 'react';

import { ButtonArea, Checkbox, MnemonicSeed, NextStepButton, VerticalSpace } from '../../components';
import useToast from '../../hooks/useToast';

interface Props {
  onNextStep: () => void;
  seed: string;
}

const onCopy = (): void => {
  const mnemonicSeedTextElement = document.querySelector('textarea');

  if (!mnemonicSeedTextElement) {
    return;
  }

  mnemonicSeedTextElement.select();
  document.execCommand('copy');
};

function Mnemonic ({ onNextStep, seed }: Props): React.ReactElement<Props> {
  const [isMnemonicSaved, setIsMnemonicSaved] = useState(false);
  const { show } = useToast();
  const _onCopy = useCallback((): void => {
    onCopy();
    show('Copied');
  }, [show]);

  return (
    <>
      <MnemonicSeed
        onCopy={_onCopy}
        seed={seed}
      />
      <VerticalSpace />
      <Checkbox
        checked={isMnemonicSaved}
        label='I have saved my mnemonic seed safely.'
        onChange={setIsMnemonicSaved}
      />
      <ButtonArea>
        <NextStepButton
          isDisabled={!isMnemonicSaved}
          onClick={onNextStep}
        >
          Next step
        </NextStepButton>
      </ButtonArea>
    </>
  );
}

export default Mnemonic;
