import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import './index.css'
import App from './App/App.tsx'
import { MantineProvider } from '@mantine/core'
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <MantineProvider
      theme={{
        fontFamily: 'Open Sans, sans-serif',
        colors: {
          brand: [
            '#E3F2FD',
            '#BBDEFB',
            '#90CAF9',
            '#64B5F6',
            '#42A5F5',
            '#2196F3',
            '#1E88E5',
            '#1976D2',
            '#1565C0',
            '#0D47A1',
          ],
        },
      }}
      defaultColorScheme="light"
    >
    <App />
    </MantineProvider>
    </Provider>
  </StrictMode>
)
