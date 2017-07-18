/**
 * @file A jQuery wrapper for ColdFusion websockets. The plugin function is {@link jQuery.ws}. The configuration object is {@link jQuery.ws.config}. This plugin is written in ES6, but the package includes a build command that transpiles (and minifies) it to ES5 using {@link https://babeljs.io/|Babel}.
 * @author afurey
 * @version 1.3.0
 * @see {@link jQuery.ws}
 *
 * @example <caption>Configuring the plugin.</caption>
 * $.ws.config.url = 'ws://myserver:1234/cfusion';
 * $.ws.config.messageDefaults.app = 'myApplicationName';
 *
 * @example <caption>Initializing a websocket connection to a ColdFusion websocket channel and listening for incoming data.</caption>
 * $.ws('mychannel', function(event, data) {
 *     console.log(data);
 * });
 */

/**
 * @typedef WebSocket
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket}
 */

/**
 * @typedef MessageEvent
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent}
 */

/**
 * @typedef EventListener
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventListener}
 */

/**
 * @typedef DOMException
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMException}
 */

/**
 * @callback MessageEventListener
 * @description A callback for handling message.
 * @param {MessageEvent} event - The event received
 * @param {object} message - The message received
 */

/**
 * @callback DataEventListener
 * @description A callback for handling data messages.
 * @param {MessageEvent} event - The event received
 * @param {object} data - The message data
 * @param {object} message - The entire message
 */

/**
 * @namespace jQuery
 * @see {@link https://api.jquery.com/}
 * @description This is a jQuery plugin that extends jQuery by adding a static method ({@link jQuery.ws}). The plugin uses a configuration object to define defaults and other settings ({@link jQuery.ws.config}).
 */

/**
 * @namespace CFWebSocket
 * @description This namespace is enclosed in an anonymous scope and cannot be accessed directly.
 */
($ => {

	/**
	 * @private
	 * @name CFWebSocket.CFWebSocket.config
	 * @description Global configuration settings for the class. Set directly in the js source file for site-wide settings. Can also be accessed with {@link jQuery.ws.config}.
	 * @property {!string} url - The URL to connect to with {@link jQuery.ws}
	 * @property {!object} messageDefaults - Defaults for the control messages sent to ColdFusion
	 * @property {!string} messageDefaults.appName - The name of your ColdFusion application
	 * @property {!object} messageDefaults.customOptions - Custom options to pass to the server with every message
	 */
	let config = {
		url: 'ws://localhost:8579/cfusion',
		messageDefaults: {
			ns: 'coldfusion.websocket.channels',
			appName: 'MyApplicationName',
			customOptions: {}
		}
	};

	/**
	 * @public
	 * @class CFWebSocket.CFWebSocket
	 * @summary A WebSocket wrapper meant to be used with ColdFusion.
	 * @description This wrapper implements interfaces for both the standard JavaScript {@link WebSocket} and ColdFusion's WebSocket object (created by the <code>cfwebsocket</code> tag). Supports chaining by returning the called object with each method. Includes an {@link CFWebSocket.CFWebSocket#on|on} method that provides a familiar event-attachment interface.
	 * @param {!string} url - The url to connect to.
	 * @param {(string|object<string,DataEventListener>)} [channels] - One or more channels to subscribe to whenever the connection opens. Specify multiple channels with a comma-delimited string. You can also specify channels as an object whose keys are channel names and values are {@link DataEventListener}s. Channels (and data listeners) can also be added with the {@link CFWebSocket.CFWebSocket#subscribe|subscribe} method. DataEventListeners can also be added with the {@link CFWebSocket.CFWebSocket#on|on} method by using the <code>data</code> event.
	 * @param {!string|array<string>} [protocol] - A protocol string or array of protocol strings. See {@link WebSocket}.
	 */
	class CFWebSocket {
		constructor(url, channels, protocol) {
			let complexChannels = (typeof channels === 'object' && channels.constructor === Object);
			this.channelHandlers = (complexChannels ? channels : {});
			this.eventHandlers = {};
			this.w = this.i(url, complexChannels ? Object.keys(channels).join(',') : channels)
		}

		/**
		 * @public
		 * @member {!string} CFWebSocket.CFWebSocket#binaryType
		 * @summary Included for compatibility with JavaScript WebSockets.
		 */
		get binaryType() {
			return this.w.binaryType;
		}
		set binaryType(v) {
			this.w.binaryType = v;
		}

		/**
		 * @public
		 * @member {!number} CFWebSocket.CFWebSocket#bufferedAmount
		 * @summary Included for compatibility with JavaScript WebSockets. Readonly.
		 * @see {@link WebSocket}
		 */
		get bufferedAmount() {
			return this.w.bufferedAmount;
		}

		/**
		 * @public
		 * @member {!string} CFWebSocket.CFWebSocket#extensions
		 * @summary Included for compatibility with JavaScript WebSockets.
		 */
		get extensions() {
			return this.w.extensions;
		}
		set extensions(v) {
			this.w.extensions = v;
		}

		/**
		 * @public
		 * @member {!string} CFWebSocket.CFWebSocket#onclose
		 * @summary Included for compatibility with JavaScript WebSockets.
		 */
		get onclose() {
			return this.eventHandlers.close;
		}
		set onclose(v) {
			this.eventHandlers.close = v;
		}

		/**
		 * @public
		 * @member {!string} CFWebSocket.CFWebSocket#onerror
		 * @summary Included for compatibility with JavaScript WebSockets.
		 */
		get onerror() {
			return this.eventHandlers.error;
		}
		set onerror(v) {
			this.eventHandlers.error = v;
		}

		/**
		 * @public
		 * @member {!string} CFWebSocket.CFWebSocket#onmessage
		 * @summary Included for compatibility with JavaScript WebSockets.
		 */
		get onmessage() {
			return this.eventHandlers.message;
		}
		set onmessage(v) {
			this.eventHandlers.message = v;
		}

		/**
		 * @public
		 * @member {!string} CFWebSocket.CFWebSocket#onopen
		 * @summary Included for compatibility with JavaScript WebSockets.
		 */
		get onopen() {
			return this.eventHandlers.open;
		}
		set onopen(v) {
			this.eventHandlers.open = v;
		}

		/**
		 * @public
		 * @member {!string} CFWebSocket.CFWebSocket#protocol
		 * @summary Included for compatibility with JavaScript WebSockets.
		 */
		get protocol() {
			return this.w.protocol;
		}
		set protocol(v) {
			this.w.protocol = v;
		}

		/**
		 * @public
		 * @member {!number} CFWebSocket.CFWebSocket#readyState
		 * @summary Included for compatibility with JavaScript WebSockets. Readonly.
		 * @see {@link WebSocket}
		 */
		get readyState() {
			return this.w.readyState;
		}

		/**
		 * @public
		 * @member {!string} CFWebSocket.CFWebSocket#url
		 * @summary Included for compatibility with JavaScript WebSockets. Readonly.
		 * @see {@link WebSocket}
		 */
		get url() {
			return this.w.url;
		}

		/**
		 * @private
		 * @method CFWebSocket.CFWebSocket#i
		 * @summary A private method used internally.
		 * @description Creates a new JavaScript WebSocket object and attaches special event handlers used to fire CFWebSocket events.
		 * @param {!string} channels - Channel to initially subscribe to. Use a comma-delimited list for multiple channels.
		 * @return {WebSocket}
		 */
		i(url, channels) {
			let ws = new WebSocket(url);
			ws.onopen = () => {
				this.s('welcome', undefined, undefined, {
					subscribeTo: channels
				});
				this.f('open', arguments);
			};
			ws.onclose = () => {
				this.f('close', arguments);
			};
			ws.onmessage = event => {
				let message = event.data ? JSON.parse(event.data) : {};
				if (message.code < 0) {
					this.f('error', [event, message]);
				} else if (message.type === 'data') {
					this.f('data', (message.channelname && message.channelname in this.channelHandlers ? message.channelname : undefined), [event, ('data' in message && message.data ? JSON.parse(message.data) : {}), message]);
				} else if (message.reqType === 'subscribeTo') {
					if (message.channelssubscribedto) {
						this.f('subscribe', [event, message]);
					} else {
						this.f('error', [event, message]);
					}
				} else if (message.reqType) {
					this.f(message.reqType, [event, message]);
				} else {
					this.f('error', [event, message]);
				}
				this.f('message', [event, message]);
			};
			ws.onerror = () => {
				this.f('error', arguments);
			};
			return ws;
		}

		/**
		 * @private
		 * @method CFWebSocket.CFWebSocket#f
		 * @summary A private method used internally.
		 * @description Runs an event handler.
		 * @param {!string} name - The name of the event
		 * @param {!string} [channel] - The name of the channel, if applicable
		 * @param {!array} args - Arguments to pass to the handler
		 */
		f(name, channel, args) {
			if (args === undefined) {
				args = channel;
				channel = undefined;
			}
			if (channel && name === 'data') {
				this.channelHandlers[channel].apply(this, args);
			} else if (name in this.eventHandlers) {
				this.eventHandlers[name].apply(this, args);
			}
		}

		/**
		 * @private
		 * @method CFWebSocket.CFWebSocket#s
		 * @summary A private method used internally.
		 * @description Sends a ColdFusion websocket control message.
		 * @param {!string} type - The type of message
		 * @param {!string} [channel] - The channel
		 * @param {!object} [data] - Custom options
		 * @param {!object} [extras] - Extra parameters to send
		 */
		s(type, channel, data, extras) {
			this.w.send(JSON.stringify($.extend(true, {}, config.messageDefaults, {
				type,
				channel,
				customOptions: data
			}, extras)));
		}
		
		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#send
		 * @summary Included for compatibility with JavaScript WebSockets.
		 * @description Sends data to the server using the websocket connection. Note that this is not the same as publishing on a channel (see the {@link CFWebSocket.CFWebSocket#publish|publish} method).
		 * @param {!(string|object|array)} data - The data to send to the server
		 * @returns {CFWebSocket.CFWebSocket}
		 * @throws {DOMException} If the connection is not currently OPEN
		 * @throws {DOMException} If the data is a string that has unpaired surrogates
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#send()}
		 */
		send(data) {
			if ((typeof data === 'object' && channels.constructor === Object) || Array.isArray(data)) {
				this.w.send(JSON.stringify(data));
			} else {
				this.w.send(data);
			}
			return this;
		}

		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#close
		 * @summary Included for compatibility with JavaScript WebSockets.
		 * @description Closes the websocket connection.
		 * @param {!number} [code] - A code to send to the server. See {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes}.
		 * @param {!string} [reason] - A human-readable message. No longer than 123 bytes of UTF-8 text.
		 * @returns {CFWebSocket.CFWebSocket}
		 * @throws {DOMException} If an invalid code was specified
		 * @throws {DOMException} If the reason string is too long or contains unpaired surrogates
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#close()}
		 */
		close(code, reason) {
			this.w.close(code, reason);
			return this;
		}

		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#getSubscriberCount
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description Retreives the subscriber count from the ColdFusion server.
		 * @param {!string} channel - The name of the channel to check
		 * @param {MessageEventListener} callback - A callback to run once the response is received from the server
		 * @returns {CFWebSocket.CFWebSocket}
		 */
		getSubscriberCount(channel, callback) {
			this.s('getSubscriberCount', channel);
			if (callback) {
				this.eventHandlers.getSubscriberCount = callback;
			}
			return this;
		}

		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#getSubscriptions
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description Retreives the channels that the client is subscribed to.
		 * @param {MessageEventListener} callback - A callback to run once the response is received from the server
		 * @return {CFWebSocket.CFWebSocket}
		 */
		getSubscriptions(callback) {
			this.s('getSubscriptions');
			if (callback) {
				this.eventHandlers.getSubscriptions = callback;
			}
			return this;
		}

		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#isConnectionOpen
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description Checks if the connection is open.
		 * @return {boolean}
		 * @deprecated Use {@link CFWebSocket.CFWebSocket#readyState|readyState} instead.
		 */
		isConnectionOpen() {
			return this.w.readyState === 1;
		}

		/**
		 * @public
		 * @method  CFWebSocket.CFWebSocket#openConnection
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description Opens the connection if it was closed. If the connection is already open, does nothing.
		 * @param {!string} [url] - If provided, a new URL to connect to, else uses the last provided URL
		 * @returns {CFWebSocket.CFWebSocket}
		 * @deprecated It is recommended that you create a new CFWebSocket object when you want to open a connection. The current specification for JavaScript WebSockets does not include an open method.
		 */
		openConnection(url=this.url) {
			if (!this.isConnectionOpen()) {
				this.w = this.i(url);
			}
			return this;
		}

		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#closeConnection
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description An alias of {@link CFWebSocket.CFWebSocket#close}.
		 * @see {@link CFWebSocket.CFWebSocket#close}
		 * @deprecated You should use the {@link CFWebSocket.CFWebSocket#close|close} method instead.
		 */
		closeConnection() {
			return this.close();
		}
		
		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#subscribe
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description Subscribes to a single ColdFusion websocket channel.
		 * @param {!string} channel - The channel to subscribe to
		 * @param {!object} [data] - The custom options to pass to the server; can be used by the server to filter messages
		 * @param {DataEventListener} [callback] - A data handler to use for the subscribed channel only
		 * @returns {CFWebSocket.CFWebSocket}
		 */
		subscribe(channel, data, callback) {
			this.s('subscribe', channel, data);
			if (callback) {
				this.channelHandlers[channel] = callback;
			}
			return this;
		}
		
		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#unsubscribe
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description Unsubscribes from a single ColdFusion websocket channel.
		 * @param {!string} channel - The channel to unsubscribe from
		 * @returns {CFWebSocket.CFWebSocket}
		 */
		unsubscribe(channel) {
			this.s('unsubscribe', channel);
			return this;
		}

		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#publish
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description Publishes data on a ColdFusion websocket channel.
		 * @param {!string} channel - The channel to publish on
		 * @param {!object} data - The data to publish
		 * @param {object} options - Extra data to send to the server, such as data used for a filter/selector
		 * @returns {CFWebSocket.CFWebSocket}
		 */
		publish(channel, data, options) {
			this.s('publish', channel, options, {
				data: data
			});
			return this;
		}
		
		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#authenticate
		 * @summary Included for compatibility with ColdFusion WebSockets.
		 * @description Sends an authentication message to the ColdFusion server. This will trigger your ColdFusion application's {@link https://helpx.adobe.com/coldfusion/cfml-reference/coldfusion-functions/functions-m-r/onwsauthenticate.html|onWSAuthenticate} callback.
		 * @param  {!string} username
		 * @param  {!string} password
		 */
		authenticate(username, password) {
			this.s('authenticate', undefined, undefined, {
				username: username,
				password: password
			});
			return this;
		}

		/**
		 * @public
		 * @method CFWebSocket.CFWebSocket#on
		 * @summary Provides a familiar event-attachment interface.
		 * @description Sets an event handler for the CFWebSocket. Each event can have only one handler. Adding a second handler to an event that already has one overwrites the original handler.
		 * @param {!string} event - Supported events: open, subscribe, welcome, data, unsubscribe, close, error. Using any other event names results in undefined behavior.
		 * @param {!(MessageEventListener|DataEventListener)} handler - The callback to use for the event
		 * @returns {CFWebSocket.CFWebSocket}
		 * 
		 * @example <caption>The below example shows how you can use this method to attach event handlers.</caption>
		 * $.ws('mychannel').on('open', function(event, full) {
		 *     console.log('Connected!');
		 * });
		 */
		on(event, handler) {
			this.eventHandlers[event] = handler;
			return this;
		}

	}


	//JQUERY

	/**
	 * @public
	 * @function jQuery.ws
	 * @description Creates a CFWebSocket object, which is a wrapper for JavaScript's own {@link WebSocket} object with added methods for use with ColdFusion's websocket channels.
	 * @param {string|object<string,DataEventListener>} [channels] - Channel(s) to initially subscribe to. For multiple channels use a comma-delimited list. Use an object whose keys are channels and values are DataEventListeners to specify a separate data listener for each channel.
	 * @param {(DataEventListener|object<string,EventListener>)} [dataHandler] - Either a handler to use for incoming data messages or an object whose keys are vailid events (open, subscribe, welcome, data, unsubscribe, close, error) and values are EventListeners for those events.
	 * @returns {CFWebSocket.CFWebSocket}
	 *
	 * @example <caption>The below examples connects to <code>mychannel</code> and logs any incoming data messages.</caption>
	 * $.ws('mychannel', function(event, data, message) {
	 *     console.log(data);
	 * });
	 *
	 * @example <caption>In this example we subscribe to multiple channels. Here the same data handler will be used for both channels. To use different handlers, you must call the function separately for each channel.</caption>
	 * $.ws('mychannel1,mychannel2', function(event, data, message) {
	 *     console.log(data);
	 * });
	 *
	 * @example <caption>This example shows how you can set multiple event handlers at initialization. Alternatively, you could use the {@link CFWebSocket.CFWebSocket#on} method.</caption>
	 * $.ws('mychannel', {
	 *     open: function(event, message) {
	 *         console.log('Connected!');
	 *     }
	 *     data: function(event, data, message) {
	 *         console.log(data);
	 *     },
	 *     close: function(event, message) {
	 *         console.log('Disconnected!');
	 *     }
	 * });
	 *
	 * @example <caption>Setting a unique data handler for each channel. Here we subscribe to <code>channel1</code> and <code>channel2</code>.</caption>
	 * $.ws({
	 *     channel1: function(event, data, message) {
	 *         console.log(1);
	 *     },
	 *     channel2: function(event, data, message) {
	 *         console.log(2);
	 *     }
	 * });
	 *
	 * @example <caption>You can also save a reference to the CFWebSocket object. This can be useful if you want to be able to add/remove channels, publish on the channel, or send data. Warning: make sure you wait until the WebSocket is connected before trying to use it this way.</caption>
	 * var myWebSocket = $.ws(...);
	 * ...
	 * myWebSocket.publish('somechannel', { message: 'Hello, World!' });
	 */
	$.ws = (channels, arg) => {
		let ws = new CFWebSocket($.ws.config.url, channels);
		if ($.isPlainObject(arg)) {
			ws.eventHandlers = arg;
		} else if (typeof arg === 'function') {
			ws.eventHandlers.data = arg;
		}
		return ws;
	};

	/**
	 * @public
	 * @name jQuery.ws.config
	 * @namespace jQuery.ws.config
	 * @description Global configuration settings for the plugin.
	 * @property {!string} url - The URL to connect to with {@link jQuery.ws}
	 * @property {!object} messageDefaults - Defaults for the control messages sent to ColdFusion
	 * @property {!string} messageDefaults.appName - The name of your ColdFusion application
	 * @property {!object} messageDefaults.customOptions - Custom options to pass to the server with every message
	 *
	 * @example <caption>Passing an auth token with every message to automatically authenticate. This example uses js-cookie.</caption>
	 * $.ws.config.messageDefaults.customOptions.authkey = Cookies.get('authkey');
	 *
	 * @example <caption>Validating an authkey sent in custom options in the channel listener's allowSubscribe callback. The authKeyIsActive function is a stand-in for your own auth key validation logic.</caption>
	 * component extends="CFIDE.websocket.ChannelListener" {
	 *     ...
	 *     public boolean function allowSubscribe(required struct subscriberInfo) {
	 *         if (authKeyIsActive(arguments.subscriberInfo.authkey)) {
	 *             return true;
	 *         }
	 *         return false;
	 *     }
	 *     ...
	 * }
	 */
	$.ws.config = config;

})(jQuery);