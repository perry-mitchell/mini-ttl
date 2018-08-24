const sleep = require("sleep-promise");
const TTLValue = require("../../source/index.js");

describe("TTLValue", function() {
    it("can be instantiated", function() {
        expect(() => {
            new TTLValue("abc");
        }).to.not.throw();
    });

    it("expires values", function() {
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        const val1 = new TTLValue(5, 100);
        const val2 = new TTLValue(5, 200);
        val1.on("valueExpired", spy1);
        val2.on("valueExpired", spy2);
        return sleep(300).then(() => {
            expect(spy1.calledBefore(spy2)).to.be.true;
            expect(val1.value).to.be.null;
            expect(val2.value).to.be.null;
        });
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
