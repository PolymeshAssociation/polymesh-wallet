import { ThemeProps } from '../types';

import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

import copy from '../assets/copy.svg';
import ActionText from './ActionText';
import TextAreaWithLabel from './TextAreaWithLabel';

interface Props {
  seed: string;
  onCopy: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

function MnemonicSeed ({ className, onCopy, seed }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <TextAreaWithLabel
        className='mnemonicDisplay'
        isReadOnly
        label='Generated 12-word mnemonic seed:'
        value={seed}
      />
      <div className='buttonsRow'>
        <ActionText
          className='copyBtn'
          data-seed-action='copy'
          icon={copy}
          onClick={onCopy}
          text='Copy to clipboard'
        />
      </div>
    </div>
  );
}

export default styled(MnemonicSeed)(({ theme }: ThemeProps) => `
  margin-top: 21px;

  .buttonsRow {
    display: flex;
    flex-direction: row;

    .copyBtn {
      margin-right: 32px;
    }
  }

  .mnemonicDisplay {
    textarea {
      color: ${theme.primaryColor};
      font-size: ${theme.fontSize};
      height: unset;
      letter-spacing: -0.01em;
      line-height: ${theme.lineHeight};
      margin-bottom: 10px;
      padding: 14px;
    }
  }
`);
