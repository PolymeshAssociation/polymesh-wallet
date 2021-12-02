import React from 'react';
// import { SignerPayloadJSON } from '@polkadot/types/types';
import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
// import { networkLabels } from '@polymathnetwork/extension-core/constants';
// import { SvgAlertCircle } from '@polymathnetwork/extension-ui/assets/images/icons';
// import { PolymeshContext } from '@polymathnetwork/extension-ui/components';
// import { getPolyCallDetails } from '@polymathnetwork/extension-ui/messaging';
// import { Box, Flex, Icon, Loading, Text } from '@polymathnetwork/extension-ui/ui';
import { Flex, Loading } from '@polymathnetwork/extension-ui/ui';
// import { genesisToNetworkName } from '@polymathnetwork/extension-ui/util/chains';

// import { toast } from 'react-toastify';
import Method from './Method';

// const toastId = 'network-mismatch';

interface Props {
  callDetails?: ResponsePolyCallDetails;
  loading: boolean;
}

function Extrinsic({ callDetails, loading }: Props): React.ReactElement<Props> {
  // const { networkState: { selected: selectedNetwork } } = useContext(PolymeshContext);
  // const [callDetails, setCallDetails] = useState<ResponsePolyCallDetails>();

  // @TODO: determine how to detect network mismatch differently. Since genesis hash can be the same for different networks.
  // useEffect(() => {
  //   const targetNetwork = genesisToNetworkName(request.genesisHash);
  //   const networkMismatch = targetNetwork !== selectedNetwork;
  //   const selectedLabel = networkLabels[selectedNetwork];
  //   const targetLabel = !!targetNetwork && targetNetwork in networkLabels
  //     ? networkLabels[targetNetwork]
  //     : 'Unknown network';
  //   const msg = `"${selectedLabel}" is selected on wallet while submitting an extrinsic to "${targetLabel}".
  //   Network and Protocol fee estimation might not be accurate.`;

  //   if (networkMismatch) {
  //     toast.error(
  //       <Flex alignItems='flex-start'
  //         flexDirection='column'>
  //         <Flex>
  //           <Icon Asset={SvgAlertCircle}
  //             color='yellow.0'
  //             height={20}
  //             width={20} />
  //           <Box ml='s'>
  //             <Text color='white'
  //               variant='b1m'>
  //               Network mismatch detected
  //             </Text>
  //           </Box>
  //         </Flex>
  //         <Box mt='4px'>
  //           <Text color='gray.4'
  //             variant='b3'>
  //             {msg}
  //           </Text>
  //         </Box>
  //       </Flex>, {
  //         toastId,
  //         hideProgressBar: true,
  //         closeButton: true,
  //         autoClose: false
  //       }
  //     );
  //   } else {
  //     toast.dismiss(toastId);
  //   }
  // }, [request, selectedNetwork]);

  // useEffect(() => {
  //   setLoading(true);
  //   getPolyCallDetails(request)
  //     .then((callDetails) => {
  //       setCallDetails(callDetails);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setLoading(false);
  //     });
  // }, [request]);

  return (
    <>
      {loading && (
        <Flex alignItems="center" justifyContent="center" my="l">
          <Loading />
        </Flex>
      )}
      {callDetails && <Method call={callDetails} />}
    </>
  );
}

export default React.memo(Extrinsic);
