import { Box, Text, TextInput } from '@polymeshassociation/extension-ui/ui';
import React, { useCallback } from 'react';

interface Props {
  className?: string;
  error?: string | null;
  isBusy: boolean;
  onSign: () => Promise<void>;
  password: string;
  setError: (error: string | null) => void;
  setPassword: (password: string) => void;
}

function Unlock({
  className,
  error,
  isBusy,
  password,
  setError,
  setPassword,
}: Props): React.ReactElement<Props> {
  const _onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setPassword(e.target.value);
      setError(null);
    },
    [setError, setPassword]
  );

  return (
    <div className={className} style={{ width: '100%' }}>
      <Box>
        <Text color="gray.1" variant="b2m">
          Wallet password
        </Text>
      </Box>
      <Box mb="s">
        <TextInput
          autoFocus={true}
          disabled={isBusy}
          invalid={!password || !!error}
          name="currentPassword"
          onChange={_onChangePassword}
          placeholder="Enter wallet password"
          type="password"
          value={password}
        />
        {error && (
          <Box>
            <Text color="alert" variant="b3">
              {'Invalid password'}
            </Text>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default React.memo(Unlock);
