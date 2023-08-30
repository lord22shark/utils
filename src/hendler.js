/**
 * Hendler - a handler for errors in browser, considering window.onerror event
 * The "e" in hendler (typo of handler) is a prank... for "handling errors" for I cannot create "Error" in JS
 * First to be imported in browser
 */ 

if (typeof(window) !== 'undefined' && typeof (window.document) !== 'undefined') {

	/**
	 * 
	 */ 
	class Hendler {

		/**
		 * uri:String - URI
		 * method:String - GET, POST...
		 * cancel:Boolean - Cancel or not window.onerror
		 * payloader:Function - function to call inside on error to fetch user session data, identifier
		 */ 
		constructor (uri, method, cancel, payloader) {

			// handler uri, verb, cancell - exception, nothing happens

			this.previousBehavior = null;

			if ((window.onerror) && (typeof(window.onerror) == 'function')) {

				this.previousBehavior = window.onerror;

			}

			this.uri = uri;

			this.method = method;

			this.cancel = cancel;

			this.enabled = true;
			
			this.user = null;
			
			this.payload = null;

			this.payloader = null;

			this.last = null;

			if ((payloader) && (payloader instanceof Function)) {

				this.payloader = payloader;

			}

			window.onerror = function (message, source, line, column, error) {

				if (this.enabled === true) {

					this.send(message, source, line, column, error);

				}

				if (this.previousBehavior) {

					this.previousBehavior.call(window, message, source, line, column, error);

				}

				return (cancel === true);

			}.bind(this);
	  
			
		}

		/**
		 * Enable / Diasable the window.onerror
		 */ 
		toggle () {

			this.enabled = !this.enabled;

		}

		/**
		 * 
		 */ 
		identify (user) {

			this.user = user || null;

		}

		/**
		 * 
		 */ 
		load (payload) {

			this.payload = payload || null;

		}

		/**
		 * 
		 */ 
		invoke () {

			if (this.payloader) {

				var result = this.payloader.call(window);

				if ((result) && (typeof(result) === 'object')) {

					this.user = (result.hasOwnProperty('user') && result.user && typeof(result.user) === 'string') ? result.user : null;

					this.payload = (result.hasOwnProperty('payload') && result.payload) ? result.payload : null;					

				} else {

					console.warn('[HENDLER]', 'Payloader function return something that is not an object - Ignoring its use', result);

				}

			}

		}

		/**
		 * 
		 */ 
		get () {

			return this.last;

		}

		/**
		 * 
		 */ 
		send (message, source, line, column, error) {

			var url = new URL(source);

			// Call for extra "data" before define payload

			this.invoke();

			this.last = {
				name: 'Hendler',
				level: 'error',
				message: message,
				label: 'browser',
				user: this.user,
				error: {
					name: 'Major',
					level: 'MAJOR',
					status: 500,
					message: message,
					data: null,
					files: [
						{
							main: source,
							path: url.origin,
							file: url.pathname,
							line: line,
							column: column
						}
					]
				},
				database: null,
				model: null,
				reference: null,
				payload: this.payload
			};

			try {

				fetch(this.uri, {
					method: this.method.toUpperCase(),
					body: JSON.stringify(this.last),
					mode: 'cors',
					cache: 'no-cache',
					headers: new Headers({
						'content-type': 'application/json',
						'X-Hendler': 'hendler'
					})
				}).then(function (response) {

					// TODO: binary

					// TODO: status

					var contentType = response.headers.get('content-type');

					if (contentType.indexOf('application/json') !== -1) {

						return response.json();

					} else {

						return response.text();

					}

				}).then(function (response) {

					// TODO: Define strategy - Just ID?

					console.log('[HENDLER]', response);

				}).catch(function (innerFetchError) {

					console.error('[HENDLER]', innerFetchError.message, this.last);

				});

			} catch (outerFetchError) {

				console.log('[HENDLER]', outerFetchError.message, this.last);

			}

		}

		/**
		 * 
		 */ 
		fromCatch (message, source, line, column, error) {

			// TODO

		}

	}

	if (!window.utils) {

		window.utils = {};

	}

	window.utils.Hendler = Hendler;

}

	

