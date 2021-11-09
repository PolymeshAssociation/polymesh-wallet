import React, { FC } from 'react';
import { ToastContainer } from 'react-toastify';

import { ToastContainerStyle } from './styles';

export const Toast: FC = () => {
  return (
    <>
      <ToastContainer closeButton={true} position="bottom-center" />
      <ToastContainerStyle />
    </>
  );
};
