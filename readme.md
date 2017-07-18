# jQuery CF WebSocket
A wrapper for websockets meant to replace ColdFusion's client-side websocket solution with a familiar jQuery interface.

## Site Installation
To install jQuery CF WebSocket for your site, just include the minified JavaScript file on any page that needs it. The minified JavaScript (see the 'jquery.cf-websocket.min.js' file) is written for the ES5 standard for browser compatibility.

## Usage
Configure the plugin for your site. Give the plugin the URL of your ColdFusion websocket endpoint as well as your application name.
```javascript
$.ws.config.url = 'ws://localhost:8579/cfusion';
$.ws.config.messageDefaults.appName = 'MyApplicationName';
```

Create a new WebSocket connection with `$.ws()`. You can pass in one or more ColdFusion WebSocket channel names to subscribe to initially, plus a data handler that is fired for data messages only.
```javascript
$.ws('mychannel,myotherchannel', function(event, data) {
    console.log(data);
});
```

Attach event handlers with a familiar jQuery interface. Events include open, subscribe, welcome, data, close, and error.
```javascript
$.ws(/* ... */).on('open', function() {
    console.log('Hello, world!');
}).on('close', function() {
    console.log('Goodbye, world!')
});
```

Call functions from the [ColdFusion client-side websocket documentation](https://helpx.adobe.com/coldfusion/developing-applications/coldfusion-and-html-5/using-coldfusion-websocket/using-websocket-to-broadcast-messages.html#UsingtheWebSocketJavaScriptfunctions).
```javascript
var ws = $.ws(/* ... */).on('open', function() {
    if (ws.isConnectionOpen()) {
        ws.subscribe('mychannel');
        ws.publish('mychannel', {
            message: 'Hello, World!'
        });
    }
});
```

Use functions and properties from the [JavaScript WebSockets documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).
```javascript
var ws = $.ws(/* ... */);
ws.onopen = function() {
    if (ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
}
```

## Developer Environment
To start modifying this plugin, you should install [npm](https://www.npmjs.com/). Navigate to the project root and run `npm install` to install the plugin's developer dependencies. These include [jsdoc](http://usejsdoc.org/) for documentation and [babel](https://babeljs.io/) for transpilation and minification.

### Building
The source for this plugin is in the 'jquery.cf-websocket.jsx' file, which is written in the ES6 standard. To transpile it to browser-safe ES5 (see the 'jquery.cf-websocket.min.js' file), run the build command with `npm run build`. This also minifies the file.

### Generating Documentation
Use `npm run jsdoc` to generate documentation for this project.
