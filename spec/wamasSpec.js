(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../src/wamas"], factory);
    }
})(function (require, exports) {
    "use strict";
    var wamas_1 = require("../src/wamas");
    describe("WAMAS test", function () {
        var url = "http://state-wamas.wa.gov";
        // In browser, prepend the proxy URL.
        if (typeof window !== "undefined") {
            url = "Proxy.ashx?" + url;
        }
        var wamas = new wamas_1.default(url);
        var accuracyRe = /^((Close)|((Very\s?)?Approximate))$/i;
        it("should be able to correct an address", function (done) {
            var input = {
                address: "101 Is reel Rd",
                address2: "p.o. bo x 47904",
                company: "WA DOH",
                zip: "98502",
                zip4: "9656",
                state: "WA",
                city: "Tumwa",
                Consumer: "WSDOT"
            };
            wamas.correctAddress(input).then(function (output) {
                expect(output.input).toBeTruthy();
                done();
            }, function (error) {
                done.fail(error);
            });
        });
        it("should be able to geocode", function (done) {
            var input = {
                address: "101 Israel Rd SE",
                zip: "98501",
                city: "Tumwater",
                zip4: "5570",
                //AddressKey: "98501557001",
                Consumer: "WSDOT"
            };
            wamas.geocode(input).then(function (output) {
                // Expected output
                expect(accuracyRe.test(output.accuracy)).toBeTruthy("Accuracy should have expected value. Actual value was " + output.accuracy);
                expect(output.error_status !== undefined).toEqual(true);
                done();
            }, function (error) {
                done.fail(error);
            });
        });
    });
});
