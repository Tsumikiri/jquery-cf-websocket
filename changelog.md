# Change Log

## 1.0.0
- Added class `CFWebSocket`
    + Added methods: `on`
- Added function `$.ws`
- Added object `$.ws.config`

## 1.0.1
- Bugfixes

## 1.1.0
- Changed class `CFWebSocket` to implement most of the expected interface for ColdFusion's client-side websocket object
    + Added methods: `getSubscriberCount`, `getSubscriptions`, `isConnectionOpen`, `openConnection`, `closeConnection`, `subscribe`, `unsubscribe`, `publish`, `authenticate`
        * These methods return the CFWebSocket instance, rather than the expected return values

## 1.2.0
- Changed class `CFWebSocket` to implement the expected interface for JavaScript's `WebSocket` class
    + Added methods: `send`, `close`
        * These methods return the CFWebSocket instance, rather than the expedcted return values
    + Added members: `binaryType`, `bufferedAmount`, `extensions`, `onclose`, `onerror`, `onmessage`, `onopen`, `protocol`, `readyState`, `url`
- Deprecated `isConnectionOpen` in favor of the `readyState` member
- Deprecated `openConnection` because current specification for JavaScript WebSockets does not support a way to reopen a WebSocket's connection, instead a new WebSocket must be instantiated
- Deprecated `closeConnection` in favor of the `close` method

## 1.2.1
- A subscribe failure now triggers the `error` event instead of the `subscribe` event

## 1.3.0
- Codebase rewritten to ES6
- Now uses npm and babel to transpile to ES5 and minify
    + To build, use `npm run build`
- JSDoc generation is now included as a script in package.json
    + To generate documentation, use `npm run jsdoc`
- Public JSDoc no longer includes source links
