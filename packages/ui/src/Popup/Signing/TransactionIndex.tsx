import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

import ArrowLeftImage from '../../assets/arrowLeft.svg';
import { Svg } from '../../components';

interface Props {
  className?: string;
  index: number;
  totalItems: number;
  onNextClick: () => void;
  onPreviousClick: () => void;
}

interface ArrowProps {
  isActive: boolean;
}

function TransactionIndex ({ className,
  index,
  onNextClick,
  onPreviousClick,
  totalItems }: Props): React.ReactElement<Props> {
  const previousClickActive = index !== 0;
  const nextClickActive = index < totalItems - 1;

  const handleLeftClick = useCallback(() => previousClickActive && onPreviousClick(), [onPreviousClick, previousClickActive]);
  const handleRightClick = useCallback(() => nextClickActive && onNextClick(), [nextClickActive, onNextClick]);

  return (
    <div className={className}>
      <div className='arrowWrap left'>
        <ArrowLeft
          isActive={previousClickActive}
          onClick={handleLeftClick}
        />
      </div>
      <div className='requestLabel'>
        {`Request ${index + 1} of ${totalItems}`}
      </div>
      <div className='arrowWrap right'>
        <ArrowRight
          isActive={nextClickActive}
          onClick={handleRightClick}
        />
      </div>
    </div>
  );
}

const ArrowLeft = styled(Svg).attrs(() => ({
  src: ArrowLeftImage
}))<ArrowProps>`
  display: inline-block;
  background: ${({ isActive }): string =>
    isActive ? 'white' : 'rgba(255, 255, 255, 0.4)'};
  cursor: ${({ isActive }): string => (isActive ? 'pointer' : 'default')};
  width: 14px;
  height: 14px;
`;

ArrowLeft.displayName = 'ArrowLeft';

const ArrowRight = styled(ArrowLeft)`
  transform: rotate(180deg);
`;

ArrowRight.displayName = 'ArrowRight';

export default styled(TransactionIndex)(
  () => css`
  align-items: center;
  column-gap: 12px;
  display: flex;
  justify-content: space-between;
  width: 100%;

  .requestLabel {
    color: white;
    flex: 1;
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
    text-align: center;
  }

  .arrowWrap {
    align-items: center;
    display: flex;
    flex: 0 0 24px;
    justify-content: center;
  }
`
);
