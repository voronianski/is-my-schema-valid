# is-my-schema-valid

[![build status](http://img.shields.io/travis/voronianski/is-my-schema-valid.svg?style=flat)](https://travis-ci.org/voronianski/is-my-schema-valid.js)
[![npm version](http://badge.fury.io/js/is-my-schema-valid.svg)](http://badge.fury.io/js/is-my-schema-valid)
[![Dependency Status](http://david-dm.org/voronianski/is-my-schema-valid.svg)](http://david-dm.org/voronianski/is-my-schema-valid)
<!-- [![Download Count](http://img.shields.io/npm/dm/is-my-schema-valid.svg?style=flat)](http://www.npmjs.com/package/is-my-schema-valid) -->

> Simple function that validates data according to [JSONSchema](http://json-schema.org) spec (under the hood it uses [is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)).

## Install

```bash
npm install is-my-schema-valid --save
```

## Usage

## `validate(data: Object, schema: Object, options: ?Object) -> { valid: Boolean, errors: ?Array<Object> }`

Validate data object against passed schema. Function alwats returns object with boolean `valid` field, if `valid` is `false` there will be additional `errors` field with the list of error objects.

### Options

- `filter` - filter away fields that are not in the schema, defaults to `false`
- `filterReadonly` - filter away fields that are marked as `readonly: true` in schema, defaults to `false`

**If you search for express middleware take a look on [is-express-schema-valid](https://github.com/voronianski/is-express-schema-valid).**

### Example

```javascript
import validate from 'is-my-schema-valid';

const schema = {
    email: {
        type: 'string',
        required: true,
        format: 'email'
    },
    password: {
        type: 'string',
        required: true,
        minLength: 1
    }
};

const notValidData = {email: 'foo', password: 'bar'};
const result1 = validate(notValidData, schema);
console.log(result1.valid); // false
console.log(result1.errors); // list of errors

const validData = {email: 'foo@bar.com', password: '123456'};
const result2 = validate(validData, schema);
console.log(result2.valid); // true

```

### Define schemas

When defining a schema you are able to pass a plain object. In this case `is-my-schema-valid` will automagically populate your schema with default `object` properties:

```javascript
const schema = {
    foo: {
        type: 'string',
        required: true
    }
};

// will be passed to validator as:
// { 
//   type: 'object', 
//   required: true, 
//   additionalProperties: false, 
//   properties: { 
//     foo: { 
//       type: 'string', 
//       required: true 
//     }
//   }
// }
```

In other cases when you need a different `type` use a full schema. For example, when payload needs to be an `array`:

```javascript
const schema = {
    type: 'array',
    uniqueItems: true,
    items: {
        type: 'number'
    }
};

// it will be used as is by validator
```

### Formats

There are several additional formats added for easy validating the requests:

- `"mongo-object-id"` - check if the string is a valid hex-encoded representation of a [MongoDB ObjectId](http://docs.mongodb.org/manual/reference/object-id/)
- `"alpha"` - check if the string contains only letters (a-zA-Z)
- `"alphanumeric"` - check if the string contains only letters and numbers
- `"numeric"` - check if the string contains only numbers
- `"hexadecimal"` - check if the string is a hexadecimal number
- `"hexcolor"` - check if the string is a hexadecimal color
- `"base64"` - check if a string is [Base64](https://en.wikipedia.org/wiki/Base64) encoded
- `"decimal"` - check if a string is a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
- `"int"` - check if a string is an integer
- `"float"` - check if a string is a float
- `"uuid"` - check if the string is [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)

In the example below we can ensure that id is valid [MongoDB ObjectId](http://docs.mongodb.org/manual/reference/object-id/): 

```javascript
import validate from 'is-my-schema-valid';

const schema = {
    id: {
        type: 'string',
        format: 'mongo-object-id'
    }
};
```

Just a reminder that there are default **built-in formats** supported by JSONSchema:

- `"date-time"` - date representation, as defined by [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339).
- `"email"` - internet email address, see [RFC 5322, section 3.4.1](http://tools.ietf.org/html/rfc5322).
- `"hostname"` - internet host name, see [RFC 1034, section 3.1](http://tools.ietf.org/html/rfc1034).
- `"ipv4"` - IPv4 address, according to dotted-quad ABNF syntax as defined in [RFC 2673, section 3.2](http://tools.ietf.org/html/rfc2673).
- `"ipv6"` - IPv6 address, as defined in [RFC 2373, section 2.2](http://tools.ietf.org/html/rfc2373).
- `"uri"` - a universal resource identifier (URI), according to [RFC3986](http://tools.ietf.org/html/rfc3986).

## JSONSchema

In order to get comfortable with [JSONSchema spec](http://json-schema.org) and its' features I advice you to check the book ["Understanding JSON Schema"](http://spacetelescope.github.io/understanding-json-schema) (also [PDF](http://spacetelescope.github.io/understanding-json-schema/UnderstandingJSONSchema.pdf) version) or look at [examples](http://json-schema.org/examples.html).

---

**MIT Licensed**
