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

## 1.3.1
- Errors are now defined as codes not equal to 0 (was codes less than 0)

## 1.3.2
- Message data is now automatically parsed as JSON (if the data is not valid JSON, it is passed as-is and no error is thrown)

## 1.3.3
- Handlers added for the open/close event will now fire immediately if the WebSocket has already beened opened/closed

## 1.4.0
- Removed the multiple handler initializer
- The initializer can now take `customOptions` to be passed to the server when initially subscribing to channels (channels subscribed to with the `subscribe` method will not use the customOptions passed to the initializer)

## 1.5.0
- Added the `one` method
- Added the `callback` parameter to the `authenticate` method
- Changed how callbacks are handled for the `authenticate`, `subscribe`, `getSubscriberCount`, and `getSubscriptions` methods
    + When calling a method multiple times, callbacks are queued
    + Callbacks are now executed only once and then removed

## 1.5.1
- Fixed a bug that prevented open/close events from firing when added to a WebSocket that is already opened/closed
- Added the `channel` parameter to the `on` method
- An undefined code is no longer treated as an error

## 1.5.2
- Fixed a bug that caused JSON data messages to be parsed twice (resulting in an error)

## 1.5.3
- The publish function now converts data to a string (using `JSON.stringify`) before sending it to the server
    + Data that is already a string or that cannot be stringified is passed as-is
    + This change prevents ColdFusion from getting its grubby hands in our data

## 1.5.4
- Fixed a bug that sometimes caused the wrong event handler to be fired when adding an open or close handler to an already opened or closed websocket
