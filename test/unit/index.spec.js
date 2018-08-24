const TTLValue = require("../../source/index.js");

describe("TTLValue", function() {
    it("can be instantiated", function() {
        expect(() => {
            new TTLValue("abc");
        }).to.not.throw();
    });

    describe("get:expired", function() {
        it("is correct for expired values", function() {
            const val = new TTLValue(1);
            expect(val.expired).to.be.false;
            val.expire();
            expect(val.expired).to.be.true;
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

        it("restarts the timer", function() {
            const val = new TTLValue(2, "1m");
            sinon.spy(val, "touch");
            val.value = 3;
            expect(val.touch.calledOnce).to.be.true;
            val.expire();
        });
    });

    describe("set:ttl", function() {
        it("can set string-based TTLs", function() {
            const val = new TTLValue(1);
            val.ttl = "5m";
            expect(val.ttl).to.equal(5 * 60 * 1000);
            val.ttl = "1h";
            expect(val.ttl).to.equal(1 * 60 * 60 * 1000);
            val.expire();
        });
    });

    describe("expire", function() {
        it("expires the value", function() {
            const val = new TTLValue(1);
            expect(val.expired).to.be.false;
            val.expire();
            expect(val.expired).to.be.true;
        });

        it("stops the timer", function() {
            const val = new TTLValue(1, "1m");
            expect(val._timer).to.not.be.null;
            val.expire();
            expect(val._timer).to.be.null;
        });
    });

    describe("getValue", function() {
        it("returns the value", function() {
            const val = new TTLValue(false);
            expect(val.getValue()).to.be.false;
        });

        it("restarts the timer", function() {
            const val = new TTLValue(true, "1m");
            sinon.spy(val, "touch");
            expect(val.getValue()).to.be.true;
            expect(val.touch.calledOnce).to.be.true;
            val.expire();
        });
    });

    describe("setValue", function() {
        it("sets the value", function() {
            const val = new TTLValue(false);
            val.setValue(true);
            expect(val.value).to.be.true;
        });

        it("restarts the timer", function() {
            const val = new TTLValue(true, "1m");
            sinon.spy(val, "touch");
            val.setValue(5);
            expect(val.touch.calledOnce).to.be.true;
            val.expire();
        });
    });
});
