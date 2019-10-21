import React from 'react';
import ReactDOM from 'react-dom';

import CustomScroller from '.';

it('renders the component without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CustomScroller>Test</CustomScroller>, div);
  div.remove();
});
