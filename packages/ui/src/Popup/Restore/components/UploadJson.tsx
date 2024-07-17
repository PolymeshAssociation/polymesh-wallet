import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { FC } from 'react';

import { hexToU8a, isHex, u8aToString } from '@polkadot/util';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { FormProvider, useForm } from 'react-hook-form';

import { recodeAddress } from '@polymeshassociation/extension-core/utils';
import { SvgDeleteOutline, SvgFileLockOutline } from '@polymeshassociation/extension-ui/assets/images/icons';
import { InitialsAvatar } from '@polymeshassociation/extension-ui/components/InitialsAvatar';
import { Box, Button, ButtonSmall, Flex, Icon, LabelWithCopy, Text, TextEllipsis, TextInput } from '@polymeshassociation/extension-ui/ui';
import verifyJsonPassword from '@polymeshassociation/extension-ui/util/verifyJsonPassword';

import { ActivityContext, PolymeshContext } from '../../../components';
import { jsonGetAccountInfo } from '../../../messaging';

interface Props {
  onContinue: (
    accountJson: KeyringPair$Json,
    jsonPassword: string,
    accountName: string
  ) => void;
}

export const UploadJson: FC<Props> = ({ onContinue }) => {
  const [filename, setFilename] = useState('');
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [accountName, setAccountName] = useState('');
  const [accountJson, setAccountJson] = useState<
  KeyringPair$Json | undefined
  >();
  const methods = useForm({
    defaultValues: {
      jsonFile: null,
      jsonPassword: ''
    }
  });
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { clearErrors, errors, handleSubmit, register, setError } = methods;
  const isBusy = useContext(ActivityContext);
  const handleError = useErrorHandler();
  const { networkState: { ss58Format } } = useContext(PolymeshContext);

  const onSubmit = useCallback((data: Record<string, string>) => {
    if (accountJson) {
      try {
        const password = data.jsonPassword;
        const jsonPassValid = verifyJsonPassword(accountJson, password);

        if (jsonPassValid) {
          onContinue(accountJson, password, accountName);
        } else {
          setError('jsonPassword', { type: 'manual' });
        }
      } catch (e) {
        handleError(e);
      }
    }
  }, [accountJson, accountName, handleError, onContinue, setError]);

  const BYTE_STR_0 = '0'.charCodeAt(0);
  const BYTE_STR_X = 'x'.charCodeAt(0);
  const NOOP = (): void => undefined;

  const convertResult = useCallback((
    result: ArrayBuffer,
    convertHex?: boolean
  ): Uint8Array => {
    const data = new Uint8Array(result);

    // this converts the input (if detected as hex), vai the hex conversion route
    if (convertHex && data[0] === BYTE_STR_0 && data[1] === BYTE_STR_X) {
      const hex = u8aToString(data);

      if (isHex(hex)) {
        return hexToU8a(hex);
      }
    }

    return data;
  }, [BYTE_STR_0, BYTE_STR_X]);

  const showUpload = useCallback(() => {
    fileRef.current.click();
  }, []);

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onabort = NOOP;
    reader.onerror = NOOP;

    reader.onload = async ({ target }: ProgressEvent<FileReader>) => {
      if (target?.result) {
        try {
          const name = file.name;
          const data = convertResult(target.result as ArrayBuffer, false);

          setFilename(name);

          const json = JSON.parse(u8aToString(data)) as KeyringPair$Json;
          const accountInfo = await jsonGetAccountInfo(json);

          setAccountName(accountInfo.name);
          setAccountJson(json);

          clearErrors('jsonFile');
        } catch (_error) {
          setError('jsonFile', { type: 'invalid' });
        }
      }
    };

    reader.readAsArrayBuffer(file);
  }, [clearErrors, convertResult, setError]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.target?.files?.[0] && readFile(e.target?.files?.[0]);
  }, [readFile]);

  const clearUploadedFile = useCallback(() => {
    setAccountJson(undefined);
    setFilename('');
    setAccountName('');
  }, []);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    handleSubmit(onSubmit)(e).catch(console.error);
  }, [handleSubmit, onSubmit]);

  return (
    <>
      <Box mx='s'>
        <Box pt='s'>
          <Text
            color='gray.1'
            variant='b2m'
          >
            JSON file
          </Text>
        </Box>
        <>
          <input
            accept='.json'
            hidden={true}
            name='jsonFile'
            onChange={handleFileChange}
            ref={fileRef}
            type='file'
          />
          <Box mt='s'>
            <ButtonSmall
              fluid
              onClick={showUpload}
              variant='secondary'
            >
              Choose file
            </ButtonSmall>
            {errors.jsonFile && (
              <Box mt='s'>
                <Text
                  color='alert'
                  variant='b3'
                >
                  {errors.jsonFile.type === 'required' &&
                    'Json file is require'}
                  {errors.jsonFile.type === 'invalid' &&
                    'Uploaded file is invalid'}
                </Text>
              </Box>
            )}
          </Box>
        </>
        {accountJson && (
          <>
            <Flex mt='s'>
              <Box mr='s'>
                <Flex
                  backgroundColor='gray7'
                  borderRadius='50%'
                  height='24px'
                  justifyContent='center'
                  width='24px'
                >
                  <Icon
                    Asset={SvgFileLockOutline}
                    color='gray4'
                    height={14}
                    width={14}
                  />
                </Flex>
              </Box>
              <Box mr='s'>
                <Text
                  color='gray1'
                  variant='b2'
                >
                  <TextEllipsis size={32}>{filename}</TextEllipsis>
                </Text>
              </Box>
              <Box
                onClick={clearUploadedFile}
                style={{ cursor: 'pointer' }}
              >
                <Icon
                  Asset={SvgDeleteOutline}
                  color='gray4'
                  height={18}
                  width={18}
                />
              </Box>
            </Flex>
            <Box mt='m'>
              <Flex justifyContent='space-between'>
                <InitialsAvatar name={accountName} />
                <Box
                  ml='s'
                  width='100%'
                >
                  <Flex
                    flexDirection='row'
                    justifyContent='space-between'
                  >
                    <Flex flexDirection='row'>
                      <Text
                        color='gray.1'
                        variant='b2m'
                      >
                        {accountName}
                      </Text>
                    </Flex>
                  </Flex>
                  <LabelWithCopy
                    color='gray.3'
                    text={
                      accountJson?.address
                        ? recodeAddress(accountJson.address, ss58Format)
                        : ''
                    }
                    textSize={30}
                    textVariant='b3'
                  />
                </Box>
              </Flex>
            </Box>
            <FormProvider {...methods}>
              <form
                id='accountForm'
                onSubmit={handleFormSubmit}
              >
                <Box mt='s'>
                  <Box>
                    <Text
                      color='gray.1'
                      variant='b2m'
                    >
                      JSON Password
                    </Text>
                  </Box>
                  <Box>
                    <TextInput
                      inputRef={register({ required: true })}
                      name='jsonPassword'
                      placeholder='Enter JSON file password'
                      type='password'
                    />
                    {errors.jsonPassword && (
                      <Box>
                        <Text
                          color='alert'
                          variant='b3'
                        >
                          {errors.jsonPassword.type === 'required' &&
                            'Required field'}
                          {errors.jsonPassword.type === 'manual' &&
                            'Invalid password'}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </form>
            </FormProvider>
          </>
        )}
      </Box>
      <Flex
        flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='s'
      >
        <Button
          busy={isBusy}
          disabled={!accountJson}
          fluid
          form='accountForm'
          type='submit'
        >
          Verify
        </Button>
      </Flex>
    </>
  );
};
