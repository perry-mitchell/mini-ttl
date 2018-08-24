const EventEmitter = require("eventemitter3");
const ms = require("ms");

class TTLValue extends EventEmitter {
    constructor(value, ttl = null, { expiryValue = null, touchOnRead = true } = {}) {
        super();
        this._value = value;
        this._expired = false;
        this._ttl = ttl;
        this._timer = null;
        this.expiryValue = expiryValue;
        this.touchOnRead = touchOnRead;
        this._touch();
    }

    get expired() {
        return this._expired;
    }

    get ttl() {
        return this._ttl;
    }

    get value() {
        if (this.touchOnRead) {
            this._touch();
        }
        return this._value;
    }

    set ttl(timeToLive) {
        if (timeToLive === null) {
            this._ttl = null;
            this._touch();
            return;
        }
        const milliseconds = typeof timeToLive === "string" ? ms(timeToLive) : timeToLive;
        if (isNaN(milliseconds) || milliseconds <= 0) {
            throw new Error(
                `Invalid value for TTL: Expected a number or time-string: ${timeToLive}`
            );
        }
        this._ttl = milliseconds;
        this._touch();
    }

    set value(newValue) {
        this._value = newValue;
        this._expired = false;
        this._touch();
        this.emit("valueSet");
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
        this._timer = setTimeout(() => this._expire(), this.ttl);
    }

    _expire() {
        this._expired = true;
        this._value = this.expiryValue;
        this.emit("valueExpired");
    }
}

module.exports = TTLValue;
