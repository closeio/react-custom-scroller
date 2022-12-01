import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { CustomScroller } from '.';

describe('CustomScroller Component', () => {
  it('renders the CustomScroller component without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.createRoot(div).render(<CustomScroller>Test</CustomScroller>);
    div.remove();
  });
});
