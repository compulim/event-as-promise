import { createRoot } from 'react-dom/client';

import App from './App';

const rootElement = document.getElementsByTagName('main')[0];

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
rootElement && createRoot(rootElement).render(<App />);
