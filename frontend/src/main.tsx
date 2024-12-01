import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
import { AppContextProvider } from './context/AppContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </AppContextProvider>
    </QueryClientProvider>
  // </StrictMode>,
);
