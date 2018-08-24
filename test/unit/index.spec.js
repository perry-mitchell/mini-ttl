const TTLValue = require("../../source/index.js");

describe("TTLValue", function() {
    it("can be instantiated", function() {
        expect(() => {
            new TTLValue("abc");
        }).to.not.throw();
    });

    describe("get:value", function() {
        it("gets the value", function() {
            const val = new TTLValue(1);
            expect(val.value).to.equal(1);
        });

        it("returns the expiry-value if expired", function() {
            const val = new TTLValue(1);
            val.expire();
            expect(val.value).to.be.null;
        });
    });
});
