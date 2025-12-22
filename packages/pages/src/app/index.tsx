import React, { createRoot } from 'react-dom/client';

import App from './App.tsx';

const rootElement = document.getElementsByTagName('main')[0];

rootElement && createRoot(rootElement).render(<App />);
