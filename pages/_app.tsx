import { ChakraProvider } from '@chakra-ui/react';
import theme from '@chakra-ui/theme';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;