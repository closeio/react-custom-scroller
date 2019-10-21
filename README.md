# react-custom-scroller

[![NPM](https://img.shields.io/npm/v/react-custom-scroller.svg)](https://www.npmjs.com/package/react-custom-scroller) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-success)](https://prettier.io)

Super simple React component for creating a custom scrollbar cross-browser and cross-devices.

### <img height="40px" src="./close.svg" />

Interested in working on projects like this? [Close](https://close.com) is looking for [great engineers](https://jobs.close.com) to join our team!

## Install

```bash
yarn add react-custom-scroller
```

## Benefits

- Extremely lightweight (less than 2KB minzipped).
- It uses the native scroll events, so all the events work and are smooth (mouse wheel, space, page down, page up, arrows etc).
- No other 3rd-party dependencies.
- The performance is excellent!

## Usage

```jsx
import React from 'react';
import CustomScroller from 'react-custom-scroller';

const MyScrollableDiv = () => (
  <CustomScroller>Content goes here.</CustomScroller>
);
```

## License

MIT © [Close](https://github.com/closeio)
