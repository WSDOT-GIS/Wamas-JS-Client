/*global define,exports,module*/
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like enviroments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.Wamas = factory();
	}
}(this, function () {

	/** Creates a query string using the properties of an object.
	 * @param {Object.<string,string>} o
	 * @returns {string}
	 */
	function createQueryString(o) {
		var output = [], value;
		for (var propName in o) {
			if (o.hasOwnProperty(propName)) {
				value = o[propName];
				output.push([propName, encodeURIComponent(value || "")].join("="));
			}
		}
		return output.join("&");
	}

	/** Creates a query string from the object.
	 * @this {(AddressCorrectionInput|GeocodeInput)}
	 * @returns {string}
	 */
	var toQueryString = function () {
		return createQueryString(this);
	};

	/** @class
	* @member {string} address
	* @member {string} address2
	* @member {string} company
	* @member {string} zip - ZIP Code
	* @member {string} zip4 - Citizen Relocation Code
	* @member {string} state
	* @member {string} city
	*/
	function AddressCorrectionInput(input) {
		this.address = input.address || null;
		this.address2 = input.address2 || null;
		this.company = input.company || null;
		this.zip = input.zip || null;
		this.zip4 = input.zip4 || null;
		this.state = input.state || null;
		this.city = input.city || null;
	}

	AddressCorrectionInput.prototype.toQueryString = toQueryString;

	/** @class
	 * @param {string} address - Address to geocode with house number and all components.
	 * @param {string} [city] - City Name (optional)
	 * @param {string} zip - 5-digit ZIP code
	 * @param {string} zip4 - ZIP + 4 (a.k.a. Citizen Relocation Code)
	 * @param {string} [AddressKey] MelissaData AddressKey from Correction Web Service (optional)
	 * @member {string} address - Address to geocode with house number and all components.
	 * @member {string} city - City Name (optional)
	 * @member {string} zip - 5-digit ZIP code
	 * @member {string} zip4 - ZIP + 4 (a.k.a. Citizen Relocation Code)
	 * @member {string} AddressKey MelissaData AddressKey from Correction Web Service (optional)
	 */
	function GeocodeInput(input) {
		this.address = input.address || null;
		this.city = input.city || null;
		this.zip = input.zip || null;
		this.zip4 = input.zip4 || null;
		this.AddressKey = input.AddressKey || null;
	}

	GeocodeInput.prototype.toQueryString = toQueryString;

	/** 
	 * @param {string} url - URL to the web services (e.g. "http://geoservicestest.wa.gov"
	 */
	function Wamas(url) {
		// Trim trailing space from url if there is one.
		url = url.replace(/\/$/, "");
		this.addressCorrectionUrl = [url, "addresscorrection_v2/service.asmx/Getstandardizedaddress"].join("/");
		this.geocodeUrl = [url, "geocoder_v2/service.asmx/FindAddress"].join("/");
	}

	Wamas.AddressCorrectionInput = AddressCorrectionInput;
	Wamas.GeocodeInput = GeocodeInput;

	if (XMLHttpRequest) {
		Wamas.prototype.createAddressCorrectionRequest = function (/**{AddressCorrectionInput}*/ input) {
			var request = new XMLHttpRequest();
			if (input && !(input instanceof AddressCorrectionInput)) {
				input = new AddressCorrectionInput(input);
			}
			request.open("get", [this.addressCorrectionUrl, input.toQueryString()].join("?"));
			return request;
		};

		Wamas.prototype.createGeocodeRequest = function (/**{GeocodeInput}*/ input) {
			var request = new XMLHttpRequest();
			if (input && !(input instanceof GeocodeInput)) {
				input = new GeocodeInput(input);
			}
			request.open("get", [this.geocodeUrl, input.toQueryString()].join("?"));
			return request;
		};
	}

	// Just return a value to define the module export.
	// This example returns an object, but the module
	// can return a function as the exported value.
	return Wamas;
}));