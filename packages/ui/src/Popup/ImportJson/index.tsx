import React, { FC, useContext, useRef, useState } from 'react';
import { ActionContext, PolymeshContext } from '../../components';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { Box, Button, ButtonSmall, Flex, Header, Heading, Icon, LabelWithCopy, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { jsonRestore, jsonVerifyPassword, jsonVerifyFile } from '../../messaging';
import { formatNumber, isHex, u8aToString, hexToU8a } from '@polkadot/util';
import { FieldError, useForm } from 'react-hook-form';

interface FileState {
  address: string | null;
  isFileValid: boolean;
  json: KeyringPair$Json | null;
}

export const ImportJSon: FC = () => {
  const { selectedAccount } = useContext(PolymeshContext);
  const [isValid, setIsValid] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File>();
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [accountName, setAccountName] = useState('');
  const [accountJson, setAccountJson] = useState<FileState>();
  const { errors, handleSubmit, register, setError, watch } = useForm({
    defaultValues: {
      jsonPassword: '',
      walletPassword: ''
    }
  });
  const formValues: { [x: string]: string; } = watch();

  const onSubmit = async (data: { [x: string]: string; }) => {}

  const BYTE_STR_0 = '0'.charCodeAt(0);
  const BYTE_STR_X = 'x'.charCodeAt(0);
  const NOOP = (): void => undefined;

  const convertResult = (result: ArrayBuffer, convertHex?: boolean): Uint8Array => {
    const data = new Uint8Array(result);

    // this converts the input (if detected as hex), vai the hex conversion route
    if (convertHex && data[0] === BYTE_STR_0 && data[1] === BYTE_STR_X) {
      const hex = u8aToString(data);

      if (isHex(hex)) {
        return hexToU8a(hex);
      }
    }

    return data;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target?.files?.[0] && readFile(e.target?.files?.[0]);
  };

  const showUpload = () => {
    fileRef.current.click();
  };

  const parseFile = async (file: Uint8Array): Promise<FileState> => {
    try {
      const json = JSON.parse(u8aToString(file)) as KeyringPair$Json;
      const isFileValid = await jsonVerifyFile(json);
      const address = json.address;

      return { address, isFileValid, json };
    } catch (error) {
      console.error(error);
    }

    return { address: null, isFileValid: false, json: null };
  };

  const readFile = (file: File) => {
    const reader = new FileReader();

    reader.onabort = NOOP;
    reader.onerror = NOOP;

    reader.onload = async ({ target }: ProgressEvent<FileReader>) => {
      if (target && target.result) {
        const name = file.name;
        const data = convertResult(target.result as ArrayBuffer, false);

        setAccountName(name.split('_exported_account_')[0]);

        const fileContent = await parseFile(data);

        setAccountJson(fileContent);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Header>
        <Box pt='m'>
          <Box
            backgroundColor='brandLightest'
            borderRadius='50%'
            height={48}
            px={14}
            py={9}
            width={48}
          >
            <Icon Asset={SvgFileLockOutline}
              color='brandMain'
              height={20}
              width={20} />
          </Box>
          <Box pt='m'
            width={220}>
            <Heading color='white'
              variant='h5'>
              Import account from JSON file
            </Heading>
          </Box>
          <Box>
            <Text color='gray.0'
              variant='b2'>
              Upload JSON file with account details below to access via Polymesh wallet.
            </Text>
          </Box>
        </Box>
      </Header>
      <Box pt='m'>
        <Text color='gray.1'
          variant='b2m'>
          JSON file
        </Text>
      </Box>
      <input hidden={true}
        name='jsonFile'
        onChange={handleFileChange}
        ref={fileRef}
        type='file'
      />
      <Box mt='s'>
        <ButtonSmall fluid
          onClick={showUpload}
          variant='secondary'>Choose file</ButtonSmall>
      </Box>
      {accountJson?.isFileValid &&
        <>
          <Box mt='m'>
            <Flex justifyContent='space-between'>
              <Box>
                <Box
                  backgroundColor='brandLightest'
                  borderRadius='50%'
                  height={40}
                  px='2'
                  width={40}
                >
                  <Flex justifyContent='center'
                    pt='s'>
                    <Text color='brandMain'
                      variant='b2m'>{accountName?.substr(0, 1)}</Text>
                  </Flex>
                </Box>
              </Box>
              <Box ml='s'
                width='100%'>
                <Flex
                  flexDirection='row'
                  justifyContent='space-between'
                >
                  <Flex flexDirection='row'>
                    <Text color='gray.1'
                      variant='b2m'>
                      {accountName}
                    </Text>
                  </Flex>
                </Flex>
                <LabelWithCopy color='gray.3'
                  text={accountJson?.address || ''}
                  textSize={30}
                  textVariant='b3'
                />
              </Box>
            </Flex>
          </Box>
          <form id='accountForm'
            onSubmit={handleSubmit(onSubmit)}>
            <Box mt='s'>
              <Box>
                <Text color='gray.1'
                  variant='b2m'>
                  JSON Password
                </Text>
              </Box>
              <Box>
                <TextInput inputRef={register({ required: true, minLength: 4 })}
                  name='jsonPassword'
                  placeholder='Enter JSON file password'
                  type='password' />
                {errors.jsonPassword &&
                  <Box>
                    <Text color='alert'
                      variant='b3'>
                      {(errors.jsonPassword as FieldError).type === 'required' && 'Required field'}
                      {(errors.jsonPassword as FieldError).type === 'minLength' && 'Invalid'}
                    </Text>
                  </Box>
                }
              </Box>
            </Box>
            {selectedAccount && selectedAccount !== '' &&
              <Box mt='s'>
                <Box>
                  <Text color='gray.1'
                    variant='b2m'>
                    Wallet Password
                  </Text>
                </Box>
                <Box>
                  <TextInput inputRef={register({ required: true, minLength: 4 })}
                    name='walletPassword'
                    placeholder='Enter 8 characters or more'
                    type='password' />
                  {errors.walletPassword &&
                    <Box>
                      <Text color='alert'
                        variant='b3'>
                        {(errors.walletPassword as FieldError).type === 'required' && 'Required field'}
                        {(errors.walletPassword as FieldError).type === 'minLength' && 'Invalid'}
                      </Text>
                    </Box>
                  }
                </Box>
              </Box>
            }
          </form>
        </>
      }
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='xs'>
        <Button disabled={!isValid}
          fluid
          form='accountForm'
          type='submit'>
          Import
        </Button>
      </Flex>
    </>
  );
};
