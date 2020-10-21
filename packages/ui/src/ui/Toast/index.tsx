import React, { FC } from 'react';
import { ToastContainer } from 'react-toastify';
import { ToastContainerStyle } from './styles';

export const Toast: FC = () => {
  return <>
    <ToastContainer
      autoClose={15000}
      closeOnClick={false}
      hideProgressBar={false}
      newestOnTop={false}
      pauseOnFocusLoss
      pauseOnHover
      position='bottom-center'
      rtl={false} />
    <ToastContainerStyle />
  </>;
};
