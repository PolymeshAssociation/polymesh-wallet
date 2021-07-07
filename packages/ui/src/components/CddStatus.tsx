import { CDD } from '@polymathnetwork/extension-core/types';
import { Flex, Icon, icons, Text } from '@polymathnetwork/polymesh-ui';
import React, { FC } from 'react';

type Props = {
  cdd?: CDD,
  withText?: boolean
}

type Status = 'checking' | 'unverified' | 'expired' | 'verified';

const statusText: Record<Status, string> = {
  checking: 'Checking...',
  expired: 'Expired',
  unverified: 'Not verified',
  verified: 'Verified'
};

const statusColor: Record<Status, string> = {
  checking: 'warning',
  expired: 'alert',
  unverified: 'alert',
  verified: 'success'
};

const statusIcon: Record<Status, React.ComponentType<React.SVGAttributes<SVGElement>>> = {
  checking: icons.SvgProgressClock,
  expired: icons.SvgAlertCircle,
  unverified: icons.SvgAlertCircle,
  verified: icons.SvgCheckboxMarkedCircle
};

export const CddStatus: FC<Props> = ({ cdd, withText = false }) => {
  const status: Status = cdd === undefined
    ? 'checking'
    : cdd === null
      ? 'unverified'
      : cdd.expiry && new Date(cdd.expiry) < new Date()
        ? 'expired'
        : 'verified';

  return (
    <Flex flexDirection='row'>
      <Flex mr='1'>
        <Icon Asset={statusIcon[status]}
          color={statusColor[status]}
          height={14}
          width={14} />
      </Flex>
      { withText && <Flex>
        <Text color={statusColor[status]}
          variant='b3m'>
          {statusText[status]}
        </Text>
      </Flex> }
    </Flex>
  );
};
