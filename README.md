# Mini-TTL
> Miniature temorary value creator

[![Build Status](https://travis-ci.org/perry-mitchell/mini-ttl.svg?branch=master)](https://travis-ci.org/perry-mitchell/mini-ttl)

## About
A tiny library to manage temporary or _expiring_ values. Wraps values in a helper instance which expires values after a given time. Extends an event emitter for easy watching.

## Installation
Install by running:

```shell
npm install mini-ttl
```

## Usage
Usage is simple, and is best explained by example:

```javascript
const TTLValue = require("mini-ttl");

// Create a user ID wrapper that expires in 30 seconds
const userID = new TTLValue(18, "30s");

// 15 seconds later
console.log(userID.value); // 18
// Value touched, timer is reset

// 29 seconds later
// Value is still valid

// Another 2 seconds later
console.log(userID.value); // null
userID.expired // true
```

Existing wrappers can be reset with new values:

```javascript
userID.value = 34;
// Timer starts again for 30 seconds of inactivity
```

### Changing the expiry value
You can set the value that the wrapper uses when it expires by providing it in the options:

```javascript
const alive = new TTLValue(true, 1500, { expiryValue: false });

// 2000ms later
alive.value // false
```

### Touch on read
Typically wrapper expiry timers are reset (touched) when reading the value. This can be disabled by setting the option.

**Before**:

```javascript
const item = new TTLValue(123, 1000);

// 998ms later
item.value;

// 900ms later
item.expired // false
```

**After setting no-touch**:

```javascript
const item = new TTLValue(123, 1000, { touchOnRead: false });

// 998ms later
item.value;

// 3ms later
item.expired // true
```
