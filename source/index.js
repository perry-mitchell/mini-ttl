const EventEmitter = require("eventemitter3");
const ms = require("ms");

class TTLValue extends EventEmitter {
    constructor(value, ttl = null, { expiryValue = null, touchOnRead = true } = {}) {
        super();
        this._value = value;
        this._expired = false;
        this.ttl = ttl;
        this._timer = null;
        this.expiryValue = expiryValue;
        this.touchOnRead = touchOnRead;
        this.touch();
    }

    get expired() {
        return this._expired;
    }

    get ttl() {
        return this._ttl;
    }

    get value() {
        if (this.touchOnRead) {
            this.touch();
        }
        return this._value;
    }

    set ttl(timeToLive) {
        if (timeToLive === null) {
            this._ttl = null;
            this.touch();
            return;
        }
        const milliseconds = typeof timeToLive === "string" ? ms(timeToLive) : timeToLive;
        if (isNaN(milliseconds) || milliseconds <= 0) {
            throw new Error(
                `Invalid value for TTL: Expected a number or time-string: ${timeToLive}`
            );
        }
        this._ttl = milliseconds;
        this.touch();
    }

    set value(newValue) {
        this._value = newValue;
        this._expired = false;
        this.touch();
        this.emit("valueSet");
    }

    expire() {
        this._expired = true;
        this._value = this.expiryValue;
        this.emit("valueExpired");
    }

    getValue() {
        return this.value;
    }

    setValue(newValue) {
        this.value = newValue;
    }

    touch() {
        clearTimeout(this._timer);
        this._timer = null;
        if (!this.ttl || this.expired) {
            return;
        }
        this._timer = setTimeout(() => this.expire(), this.ttl);
    }
}

module.exports = TTLValue;
