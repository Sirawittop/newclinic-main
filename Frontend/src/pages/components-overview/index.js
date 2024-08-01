import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Typohraphy from './Typography';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Typohraphy />
  </StrictMode>
);
