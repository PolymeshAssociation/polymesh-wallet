// @TODO: remove commented out lines as part of clean up; once alias editing is no longer missed as a feature in the header.
import { IdentifiedAccount } from '@polymeshassociation/extension-core/types';
import { recodeAddress } from '@polymeshassociation/extension-core/utils';
// import { SvgCheck, SvgPencilOutline, SvgWindowClose } from '@polymeshassociation/extension-ui/assets/images/icons';
import {
  AccountType,
  PolymeshContext,
} from '@polymeshassociation/extension-ui/components';
import { CddStatus } from '@polymeshassociation/extension-ui/components/CddStatus';
// import { renameIdentity } from '@polymeshassociation/extension-ui/messaging';
import React, { FC, useContext } from 'react';
import { useHistory } from 'react-router';

import {
  Box,
  Flex,
  Heading,
  LabelWithCopy,
  Text,
  TextEllipsis,
  TextOverflowEllipsis,
} from '../../ui';
import { formatAmount } from '../../util/formatters';

export interface Props {
  account: IdentifiedAccount;
  details?: boolean;
}

export const AccountMain: FC<Props> = ({ account, details = true }) => {
  const history = useHistory();
  // const [editing, setEditing] = useState(false);
  // const [newAlias, setNewAlias] = useState('');
  // const [hover, setHover] = useState(false);
  const {
    networkState: { ss58Format },
  } = useContext(PolymeshContext);
  // const onAction = useContext(ActionContext);

  const showAccountDetails = () => {
    history.push(`/account/details/${account?.address}`);
  };

  // const startEdit = () => {
  //   setHover(false);
  //   setNewAlias(account.didAlias);
  //   setEditing(true);
  // };

  // const stopEdit = () => {
  //   setEditing(false);
  // };

  // const mouseEnter = () => setHover(true);

  // const mouseLeave = () => setHover(false);

  // const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewAlias(e.target.value);
  // };

  // const saveAlias = async () => {
  //   account && account.did && network && (await renameIdentity(network, account.did, newAlias));
  //   stopEdit();
  //   onAction();
  // };

  return (
    <>
      {account?.did && (
        <>
          {/* {!editing && (
            <Flex alignItems='center'
              mb='xs'
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}>
              <Text color='gray.0'
                variant='b1m'>
                {account.didAlias ? toShortAddress(account.didAlias, { size: 30 }) : '[Your Polymesh Account]'}
              </Text>
              {hover && (
                <Flex ml='xs'>
                  <Icon
                    Asset={SvgPencilOutline}
                    color='gray.0'
                    height={16}
                    onClick={startEdit}
                    style={{ cursor: 'pointer' }}
                    width={16}
                  />
                </Flex>
              )}
            </Flex>
          )}
          {editing && (
            <Flex mb='xs'>
              <TextInput onChange={handleAliasChange}
                tight
                value={newAlias} />
              <Box onClick={saveAlias}
                style={{ cursor: 'pointer' }}>
                <Icon Asset={SvgCheck}
                  color='gray.0'
                  height={24}
                  width={24} />
              </Box>
              <Box onClick={stopEdit}
                style={{ cursor: 'pointer' }}>
                <Icon Asset={SvgWindowClose}
                  color='gray.0'
                  height={24}
                  width={24} />
              </Box>
            </Flex>
          )} */}
          <Box bg="polyPinkLight" borderRadius="2" py="xs">
            {account && (
              <Flex flexDirection="row" justifyContent="space-between" mx="1">
                <Flex>
                  <Text color="polyIndigo" variant="b3m">
                    <TextEllipsis size={29}>{account?.did}</TextEllipsis>
                  </Text>
                </Flex>
                <CddStatus cdd={account.cdd} withText />
              </Flex>
            )}
          </Box>
        </>
      )}
      {!account?.did && (
        <Text color="brandLighter" variant="b2m">
          Unassigned key
        </Text>
      )}
      <Flex alignItems="flexStart" mt="s">
        <Box>
          <TextOverflowEllipsis color="gray.0" maxWidth="206px" variant="b1m">
            {account?.name}
          </TextOverflowEllipsis>
        </Box>
        <Box ml="s">
          {account?.did && (
            <AccountType keyType={account?.keyType} large={true} />
          )}
        </Box>
      </Flex>
      <Flex>
        <LabelWithCopy
          color="brandLightest"
          hoverColor="brandLighter"
          text={
            account?.address ? recodeAddress(account.address, ss58Format) : ''
          }
          textSize={30}
          textVariant="b3"
        />
      </Flex>
      <Flex alignItems="baseline" mt="m">
        <Heading color="white" variant="h4">
          {formatAmount(account?.balance?.transferrable || 0)}
        </Heading>
        <Box ml="8px">
          <Heading color="white" variant="h5">
            POLYX
          </Heading>
        </Box>
      </Flex>
      <Flex>
        <Text color="white" variant="b1">
          {formatAmount(account?.balance?.locked || 0)}
        </Text>
        <Box ml="4px">
          <Text color="white" variant="b1">
            POLYX
          </Text>
        </Box>
        <Box ml="8px">
          <Text color="white" variant="b1">
            locked
          </Text>
        </Box>
      </Flex>
      {details && (
        <Box mt="m">
          <Flex
            borderColor="gray.0"
            borderRadius="100px"
            borderStyle="solid"
            borderWidth={1}
            height="32px"
            justifyContent="center"
            onClick={showAccountDetails}
            style={{ cursor: 'pointer' }}
          >
            <Text color="white" variant="b2m">
              View details
            </Text>
          </Flex>
        </Box>
      )}
    </>
  );
};
