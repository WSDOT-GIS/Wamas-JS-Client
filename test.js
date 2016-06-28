/*global Wamas*/
(function () {
    "use strict";

    var wamas = new Wamas("Proxy.ashx?http://state-wamas.wa.gov");

    wamas.correctAddress({
        address: "101 Is reel Rd",
        address2: "p.o. bo x 47904",
        company: "WA DOH",
        zip: "98502",
        zip4: "9656",
        state: "WA",
        city: "Tumwa",
        Consumer: "WSDOT"
    }, function (e) {
        console.log(e);
    });

    wamas.geocode({
        address: "101 Israel Rd SE",
        zip: "98501",
        city: "Tumwater",
        zip4: "5570",
        AddressKey: "98501557001",
        Consumer: "WSDOT"
    }, function (e) {
        console.log(e);
    });
}());