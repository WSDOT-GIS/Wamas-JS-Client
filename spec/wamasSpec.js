/// <reference path="../wamas.d.ts" />

let Wamas = require("../wamas.js");

describe("WAMAS test", () => {
    let url = "http://state-wamas.wa.gov";

    // In browser, prepend the proxy URL.
    if (typeof window !== "undefined") {
        url = "Proxy.ashx?" + url;
    }
    let wamas = new Wamas(url);

    let accuracyRe = /^((Close)|((Very\s?)?Approximate))$/i

    it("should be able to correct an address", done => {
        let input = {
            address: "101 Is reel Rd",
            address2: "p.o. bo x 47904",
            company: "WA DOH",
            zip: "98502",
            zip4: "9656",
            state: "WA",
            city: "Tumwa",
            Consumer: "WSDOT"
        };
        wamas.correctAddress(input).then(output => {
            expect(output.input).toBeTruthy();
            done();
        }, error => {
            done.fail(error);
        });
    });

    it("should be able to geocode", done => {
        let input = {
            address: "101 Israel Rd SE",
            zip: "98501",
            city: "Tumwater",
            zip4: "5570",
            //AddressKey: "98501557001",
            Consumer: "WSDOT"
        };
        wamas.geocode(input).then(output => {
            // Expected output
            
            expect(accuracyRe.test(output.accuracy)).toBeTruthy(`Accuracy should have expected value. Actual value was ${output.accuracy}`);
            expect(output.error_status !== undefined).toEqual(true);
            done();
        }, error => {
            done.fail(error);
        });

    });

});

