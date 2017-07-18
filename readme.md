#jQuery CF WebSocket
A wrapper for websockets meant to replace ColdFusion's client-side websocket solution with a familiar jQuery interface.

##Site Installation
To install jQuery CF WebSocket for your site, just include the minified JavaScript file on any page that needs it. The minified JavaScript (see the 'jquery.cf-websocket.min.js' file) is written for the ES5 standard for browser compatibility.

##Developer Environment
To start modifying this plugin, you should install [npm](https://www.npmjs.com/). Navigate to the project root and run `npm install` to install the plugin's developer dependencies. These include [jsdoc](http://usejsdoc.org/) for documentation and [babel](https://babeljs.io/) for transpilation and minification.

###Building
The source for this plugin is in the 'jquery.cf-websocket.jsx' file, which is written in the ES6 standard. To transpile it to browser-safe ES5 (see the 'jquery.cf-websocket.min.js' file), run the build command with `npm run build`. This also minifies the file.

###Generating Documentation
Use `npm run jsdoc` to generate documentation for this project.