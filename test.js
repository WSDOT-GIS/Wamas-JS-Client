/*global Wamas*/
(function () {
	"use strict";

	var wamas = new Wamas("Proxy.ashx?http://geoservicestest.wa.gov");

	function xmlToObject(xml) {
		var treeWalker = xml.createTreeWalker(xml.firstChild, NodeFilter.SHOW_ELEMENT);
		var output = {
			input: {}
		};
		var name, value;
		var inputRe = /input_(\w+)/, match;
		while (treeWalker.nextNode()) {
			name = treeWalker.currentNode.nodeName;
			value = treeWalker.currentNode.textContent;
			match = name.match(inputRe);
			if (name === "Av_date") {
				value = new Date(value);
			}

			if (match) {
				output.input[match[1]] = value;
			} else {
				output[name] = value;
			}
		}
		return output;
	}

	function handleResponse(/**{XMLHttpRequestProgressEvent}*/ e) {
		var request = e.target;
		var xml = request.responseXML;
		var output = xmlToObject(xml);
		console.log(output);
	}

	var request = wamas.createAddressCorrectionRequest({
		address: "101 Is reel Rd",
		address2: "p.o. bo x 47904",
		company: "WA DOH",
		zip: "98502",
		zip4: "9656",
		state: "WA",
		city: "Tumwa",
	});
	request.addEventListener("load", handleResponse);
	request.send();

	var geocodeRequest = wamas.createGeocodeRequest({
		address: "101 Israel Rd SE",
		zip: "98501",
		city: "Tumwater",
		zip4: "5570",
		AddressKey: "98501557001",
	});
	geocodeRequest.addEventListener("load",handleResponse);
	geocodeRequest.send();
}());