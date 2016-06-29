/*global define,exports,module,NodeFilter*/
/*jslint browser:true,white:true,vars:true*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require("node-fetch"), require('xmldom'));
    } else {
        // Browser globals (root is window)
        root.Wamas = factory(root.fetch);
    }
}(this, function (fetch, xmldom) {
    "use strict";

    if (!fetch) {
        fetch = window.fetch;
    }

    var DOMParser = xmldom ? xmldom.DOMParser : window.DOMParser;

    /**@constant {Object<string,string>}*/
    var ADDRESS_CORRECTION_RESULT_CODES = {
        AC01: "Changed the Zip Code",
        AC02: "Changed the State",
        AC03: "Changed the City",
        AC04: "Changed to Alt. Name",
        AC05: "Changed Alias",
        AC06: "Changed Address2",
        AC07: "Changed Company",
        AC08: "Changed Zip4",
        AC09: "Changed Urbanization",
        AC10: "Changed the Street Name",
        AC11: "Changed Suffix",
        AC12: "Changed Directional",
        AC13: "Changed Suite Name",
        AC14: "Changed Suite Range",
        AE01: "Zip Unknown",
        AE02: "Unknown Street",
        AE03: "Component Mismatch",
        AE04: "Non-Deliverable",
        AE05: "Multiple Matches",
        AE06: "EWS",
        AE07: "Invalid Input",
        AE08: "Invalid Suite",
        AE09: "Missing Suite",
        AE10: "Invalid Range",
        AE11: "Missing Range",
        AE12: "Invalid PO, HC or RR",
        AE13: "Missing PO, HC or RR",
        AE14: "CMRA Missing",
        AE15: "Demo Mode",
        AE16: "Expired Database",
        AE17: "in Suite Range",
        AE19: "Timed Out",
        AE20: "Suggestions Disabled",
        AS01: "Address Matched to Postal Database",
        AS02: "Street Address Match",
        AS03: "Non-USPS Address",
        AS09: "Foreign Zip Code",
        AS10: "UPS Store",
        AS13: "LACS Conversion",
        AS14: "Suite Appended Link",
        AS15: "Suite Appended by AP",
        AS16: "Address is vacant",
        AS17: "Alternate Delivery",
        AS18: "DPV Error",
        AS20: "No UPS or FedEx Delivery",
        AS22: "No Suggestions",
        AS23: "Extra Info found"
    };

    /** @typedef {Object} AddressCorrectionResult
	 * @property {string} Address - Corrected Address
	 * @example 101 Israel Rd SE
	 * @property {string} Address2 - Corrected Address line two if address one not found.
	 * @example PO Box 47904
	 * @property {string} Company - Not Corrected only used for verification of addresses.
	 * @example WA DOH
	 * @property {string} MunicipalJurisdiction - Corrected City Name
	 * @example Tumwater
	 * @property {string} ZipCode - Corrected Zip Code
	 * @example 98501
	 * @property {string} ZipPlus4 - Corrected Zip Plus 4 if found in USPS database
	 * @example 7904
	 * @property {string} StateName - Corrected State Abbreviation
	 * @example WA
	 * @property {string} County - County the address is located in
	 * @example Thurston
	 * @property {string} PreDirectional - Corrected Pre street direction
	 * @example N
	 * @property {string} Number - Parsed house number of the input address
	 * @example 101
	 * @property {string} StreetName - Corrected street name of the input address
	 * @example Israel
	 * @property {string} PreType - Corrected Pre street type
	 * @example Loop
	 * @property {string} PostDirectional - Corrected Post street direction
	 * @example SE
	 * @property {string} Unit - Corrected Unit identifier
	 * @example 14
	 * @property {string} UnitType - Corrected Unit type
	 * @example TRLR
	 * @property {string} Garbage - Leftover characters after correction and parsing occurs.
	 * @example sadfad
	 * @property {string} AddressType - Type of Address (see possible values on next page)
	 * @example Street Address
	 * @property {boolean} Found - Was the address found in the USPS database
	 * @property {string} Quality - Could also contain “Parsed but not found”
	 * @example Address found in USPS database
	 * @property {Object.<string, string>} Results - Changes made to the input data, see Result Codes below
	 * @example {AC01: "Changed the Zip Code", AC03: "Changed the City", AC10: "Changed the Street Name", AC12: "Changed Directional", AS01: "Address Matched to Postal Database"}
	 * @property {string} ErrorStatus - Any application error codes
	 * @example "Invalid input"
	 * @property {string} Candidate1 - Address Candidate
	 * @example 101 Israel Rd SW, 98501
	 * @property {string} Candidate2 - Address Candidate
	 * @example 101 Israel ST, 98502
	 * @property {string} Candidate3 - Address Candidate
	 * @property {string} Candidate4 - Address Candidate
	 * @property {string} Candidate5 - Address Candidate
	 * @property {string} AddressKey - MelissaData Unique Address Key for geocoding
	 * @example 98502965645
	 */

    /** @typedef {Object} GeocodeResult
	 * @property {string} Status - Matched (M) or Unmatched (U)
	 * @property {number} Score - Numeric score returned from ESRI’s address locators.
	 * @property {string} Source - Source data used in the address locator. 
	 * @example MAF
	 * @property {string} Accuracy - "Close", "Approximate" or "Very Approximate"
	 * @property {number} Longitude - WGS84 in decimal degrees
	 * @property {number} Latitude - WGS84 in decimal degrees
	 * @property {Date} Av_date - Date and time geocoding was attempted
	 * @property {string} - Any application messages
	 * @example "Invalid Input"
	 */

    /** @callback requestCallback
	 * @param {(AddressCorrectionResult|GeocodeResult)}
	 */

    /** Creates a query string using the properties of an object.
	 * @param {Object.<string,string>} o
	 * @returns {string}
	 */
    function createQueryString(o) {
        var output = [], value, propName;
        for (propName in o) {
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
	* @member {string} Consumer
	*/
    function AddressCorrectionInput(input) {
        this.address = input.address || null;
        this.address2 = input.address2 || null;
        this.company = input.company || null;
        this.zip = input.zip || null;
        this.zip4 = input.zip4 || null;
        this.state = input.state || null;
        this.city = input.city || null;
        this.Consumer = input.Consumer || null;
    }

    AddressCorrectionInput.prototype.toQueryString = toQueryString;

    /** @class
	 * @param {string} address - Address to geocode with house number and all components.
	 * @param {string} [city] - City Name (optional)
	 * @param {string} zip - 5-digit ZIP code
	 * @param {string} zip4 - ZIP + 4
	 * @param {string} Consumer
	 * @member {string} address - Address to geocode with house number and all components.
	 * @member {string} city - City Name (optional)
	 * @member {string} zip - 5-digit ZIP code
	 * @member {string} zip4 - ZIP + 4
	 * @member {string} Consumer
	 * 
	 */
    function GeocodeInput(input) {
        this.address = input.address || null;
        this.city = input.city || null;
        this.zip = input.zip || null;
        this.zip4 = input.zip4 || null;
        this.Consumer = input.Consumer || null;
    }

    GeocodeInput.prototype.toQueryString = toQueryString;

    /** 
	 * @param {string} url - URL to the web services (e.g. "http://state-wamas.wa.gov"
	 */
    function Wamas(url) {
        url = url || "http://state-wamas.wa.gov";

        // Trim trailing space from url if there is one.
        url = url.replace(/\/$/, "");
        this.addressCorrectionUrl = [url, "addresscorrection/service.asmx/Getstandardizedaddress"].join("/");
        this.geocodeUrl = [url, "geocoder/service.asmx/FindAddress"].join("/");
    }

    Wamas.AddressCorrectionInput = AddressCorrectionInput;
    Wamas.GeocodeInput = GeocodeInput;


    /** Converts XML returned from a WAMAS service into a JavaScript object.
	 * @param {XMLDocument} xml
	 * @returns {(GeocodeResult|AddressCorrectionResult)}
	 */
    function xmlToObject(xml) {
        var parser;
        if (typeof xml === "string") {
            parser = new DOMParser();
            xml = parser.parseFromString(xml, "application/xml");
        }

        var resultCodes, treeWalker, numericalProperty, output, name, value, inputRe, inputMatch;

        function getResultCode(value) {
            resultCodes[value] = ADDRESS_CORRECTION_RESULT_CODES[value];
        }

        numericalProperty = /^((longitude)|(latitude)|(score))$/;
        inputRe = /input_(\w+)/;
        output = {
            input: {}
        };
        if (xml.createTreeWalker) { // browser
            treeWalker = xml.createTreeWalker(xml.firstChild, NodeFilter.SHOW_ELEMENT);
            while (treeWalker.nextNode()) {
                name = treeWalker.currentNode.nodeName;
                value = treeWalker.currentNode.textContent;
                inputMatch = name.match(inputRe);
                if (name === "Av_date" || name === "MDexpires") {
                    value = new Date(value);
                } else if (numericalProperty.test(name)) {
                    value = Number(value);
                } else if (value === "") {
                    value = null;
                } else if (name === "Results") {
                    resultCodes = {};
                    value.split(",").forEach(getResultCode);
                    value = resultCodes;
                } else if (name === "Found" || name === "MailableAddress") {
                    value = !value ? null : /Yes/i.test(value);
                }

                if (inputMatch) {
                    output.input[inputMatch[1]] = value;
                } else {
                    output[name] = value;
                }
            }
        } else { // Node.js
            Array.from(xml.lastChild.childNodes, function (node) {
                name = node.localName;
                if (name) {
                    value = node.nodeValue || node.textContent;
                    inputMatch = name.match(inputRe);
                    if (name === "Av_date") {
                        value = new Date(value);
                    } else if (numericalProperty.test(name)) {
                        value = Number(value);
                    } else if (value === "") {
                        value = null;
                    } else if (name === "Results") {
                        resultCodes = {};
                        value.split(",").forEach(getResultCode);
                        value = resultCodes;
                    } else if (name === "Found") {
                        value = !value ? null : /Yes/i.test(value);
                    }

                    if (inputMatch) {
                        output.input[inputMatch[1]] = value;
                    } else {
                        output[name] = value;
                    }
                }
            });
        }
        return output;
    }

    /** Submits an Address Correction request.
     * @param {(AddressCorrectionInput|Object)} input
     * @returns {Promise.<AddressCorrectionResult>}
     */
    Wamas.prototype.correctAddress = function (/**{AddressCorrectionInput}*/ input) {
        if (input && !(input instanceof AddressCorrectionInput)) {
            input = new AddressCorrectionInput(input);
        }
        var url = [this.addressCorrectionUrl, input.toQueryString()].join("?");
        return fetch(url).then(function (response) {
            return response.text();
        }).then(function (txt) {
            return xmlToObject(txt);
        });
    };

    /** Sends a geocode request.
     * @param {(GeocodeInput|Object)} input
     * @param {requestCallback} resultHandler
     * @returns {Promise.<GeocodeResult>}
     */
    Wamas.prototype.geocode = function (/**{GeocodeInput}*/ input) {
        if (input && !(input instanceof GeocodeInput)) {
            input = new GeocodeInput(input);
        }
        var url = [this.geocodeUrl, input.toQueryString()].join("?");
        return fetch(url).then(function (response) {
            return response.text();
        }).then(function (txt) {
            return xmlToObject(txt);
        });
    };

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return Wamas;
}));