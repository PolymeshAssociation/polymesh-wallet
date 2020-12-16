import React, { FC, useContext, useRef, useState } from 'react';
import { ActivityContext } from '../../components';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { Box, Button, ButtonSmall, Flex, Header, Icon, LabelWithCopy, Text, TextEllipsis, TextInput } from '@polymathnetwork/extension-ui/ui';
import { SvgDeleteOutline, SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { jsonVerifyFile } from '../../messaging';
import { isHex, u8aToString, hexToU8a } from '@polkadot/util';
import { FieldError, FormProvider, useForm } from 'react-hook-form';
import { useErrorHandler } from 'react-error-boundary';
import verifyJsonPassword from '@polymathnetwork/extension-ui/util/verifyJsonPassword';

export interface FileState {
  address: string | null;
  isFileValid: boolean;
  json: KeyringPair$Json | null;
}

type Props = {
  onContinue: (fileState: FileState, jsonPassword: string, accountName: string) => void
}

export const UploadVerifyJson: FC<Props> = ({ onContinue }) => {
  const [filename, setFilename] = useState('');
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [accountName, setAccountName] = useState('');
  const [accountJson, setAccountJson] = useState<FileState | undefined>();
  const methods = useForm({
    defaultValues: {
      jsonPassword: ''
    }
  });
  const { clearErrors, errors, handleSubmit, register, setError } = methods;
  const isBusy = useContext(ActivityContext);
  const handleError = useErrorHandler();

  const onSubmit = (data: { [x: string]: string; }) => {
    if (accountJson && accountJson?.json && accountJson.address) {
      try {
        const json = accountJson.json;
        const password = data.jsonPassword;
        const jsonPassValid = verifyJsonPassword(json, password);

        if (jsonPassValid) {
          onContinue(accountJson, password, accountName);
        } else {
          setError('jsonPassword', { type: 'manual' });
        }
      } catch (e) {
        handleError(e);
      }
    }
  };

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
    const json = JSON.parse(u8aToString(file)) as KeyringPair$Json;
    const isFileValid = await jsonVerifyFile(json);
    const address = json.address;

    return { address, isFileValid, json };
  };

  const readFile = (file: File) => {
    const reader = new FileReader();

    reader.onabort = NOOP;
    reader.onerror = NOOP;

    reader.onload = async ({ target }: ProgressEvent<FileReader>) => {
      if (target && target.result) {
        try {
          const name = file.name;
          const data = convertResult(target.result as ArrayBuffer, false);

          setAccountName(name.split('_exported_account_')[0]);
          setFilename(name);

          const fileContent = await parseFile(data);

          setAccountJson(fileContent);

          clearErrors('jsonFile');
        } catch (error) {
          console.log('Error', error);
          setError('jsonFile', { type: 'invalid' });
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const clearUploadedFile = () => {
    setAccountJson(undefined);
    setFilename('');
    setAccountName('');
  };

  return (
    <>
      <Header headerText='Import account from JSON file'
        iconAsset={SvgFileLockOutline}>
        <Box>
          <Text color='gray.0'
            variant='b2'>
            Upload JSON file with account details below to access via Polymesh Wallet.
          </Text>
        </Box>
      </Header>
      <Box mx='s'>
        <Box pt='m'>
          <Text color='gray.1'
            variant='b2m'>
            JSON file
          </Text>
        </Box>
        {!accountJson?.isFileValid &&
          <>
            <input accept='.json'
              hidden={true}
              name='jsonFile'
              onChange={handleFileChange}
              ref={fileRef}
              type='file'
            />
            <Box mt='s'>
              <ButtonSmall fluid
                onClick={showUpload}
                variant='secondary'>Choose file</ButtonSmall>
              {errors.jsonFile &&
                      <Box mt='s'>
                        <Text color='alert'
                          variant='b3'>
                          {(errors.jsonFile as FieldError).type === 'required' && 'Json file is require'}
                          {(errors.jsonFile as FieldError).type === 'invalid' && 'Uploaded file is invalid'}
                        </Text>
                      </Box>
              }
            </Box>

          </>
        }
        {accountJson?.isFileValid &&
          <>
            <Flex>
              <Box>
                <Box
                  backgroundColor='gray.4'
                  borderRadius='50%'
                  height={24}
                  px='1'
                  py='0'
                  width={24}
                >
                  <Icon Asset={SvgFileLockOutline}
                    color='gray.3'
                    height={14}
                    width={14} />
                </Box>
              </Box>
              <Flex justifyContent='space-between'
                ml='s'>
                <Text color='gray.1'
                  variant='b2'>
                  <TextEllipsis size={32}>
                    {filename}
                  </TextEllipsis>
                </Text>
              </Flex>
              <Box onClick={clearUploadedFile}
                style={{ cursor: 'pointer' }}>
                <Icon Asset={SvgDeleteOutline}
                  color='gray.3'
                  height={18}
                  width={18} />
              </Box>
            </Flex>
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
                      pt='xs'>
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
            <FormProvider {...methods} >
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
                    <TextInput inputRef={register({ required: true })}
                      name='jsonPassword'
                      placeholder='Enter JSON file password'
                      type='password' />
                    {errors.jsonPassword &&
                      <Box>
                        <Text color='alert'
                          variant='b3'>
                          {(errors.jsonPassword as FieldError).type === 'required' && 'Required field'}
                          {(errors.jsonPassword as FieldError).type === 'manual' && 'Invalid password'}
                        </Text>
                      </Box>
                    }
                  </Box>
                </Box>
              </form>
            </FormProvider>
          </>
        }
      </Box>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='s'>
        <Button busy={isBusy}
          disabled={!accountJson?.isFileValid}
          fluid
          form='accountForm'
          type='submit'>
          Verify
        </Button>
      </Flex>
    </>
  );
};
