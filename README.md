Wamas-JS-Client
===============

This is a JavaScript client library for the [Washington Master Address Services (WAMAS)] SOAP web services.

[Washington Master Address Services (WAMAS)]:http://geoservicestest.wa.gov/testwebservices/default.aspx

## Example ##

```html
<!DOCTYPE html>
<html>
<head>
	<title>WAMAS Test</title>
</head>
<body>
	<script src="wamas.js"></script>
	<script src="test.js"></script>
</body>
</html>
```

### `test.js` ###
```javascript
/*global Wamas*/
(function () {
	"use strict";

	var wamas = new Wamas("Proxy.ashx?http://geoservicestest.wa.gov");

	wamas.correctAddress({
		address: "101 Is reel Rd",
		address2: "p.o. bo x 47904",
		company: "WA DOH",
		zip: "98502",
		zip4: "9656",
		state: "WA",
		city: "Tumwa",
	}, function (e) {
	  // Log the results to the JavaScript console.
		console.log(e);
	});

	wamas.geocode({
		address: "101 Israel Rd SE",
		zip: "98501",
		city: "Tumwater",
		zip4: "5570",
		AddressKey: "98501557001",
	}, function (e) {
	  // Log the results to the JavaScript console.
		console.log(e);
	});
}());
```
