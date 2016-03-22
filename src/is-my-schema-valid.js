import createValidator from 'is-my-json-valid';
import uniqueBy from 'unique-by';
import traverse from 'traverse';

const schemaPattern = {
    type: 'object',
    required: true,
    additionalProperties: false
};
const customFormats = {
    'mongo-object-id': /^[a-fA-F0-9]{24}$/i,
    'alpha': /^[A-Z]+$/i,
    'alphanumeric': /^[0-9A-Z]+$/i,
    'numeric': /^[-+]?[0-9]+$/,
    'hexadecimal': /^[0-9A-F]+$/i,
    'hexcolor': /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i,
    'decimal': /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/,
    'float': /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
    'int': /^(?:[-+]?(?:0|[1-9][0-9]*))$/,
    'base64': /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i,
    'uuid': /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

function _parseValidatorErrors (errors, options = {}) {
    return uniqueBy(errors, obj => {
        return obj.message && obj.field;
    }).map(error => {
        let key = error.field.split(/\.(.+)/)[1];
        let err = {};

        if (key) {
            err.key = key;
            err.message = error.message;
        } else {
            err.message = options.title ?
                `${options.title} ${error.message}` :
                `data ${error.message}`;
        }

        if (options.debug) {
            err._raw = error;
        }

        return err;
    });
}

function validate (data, schema = {}, options = {}) {
    const schemaObj = schema.type ? schema : Object.assign({}, schemaPattern, {properties: schema});
    const formats = options.formats ? Object.assign({}, customFormats, options.formats) : customFormats;
    const validator = createValidator(schemaObj, { formats });

    if (options.filter) {
        const filter = createValidator.filter(schemaObj);
        data = filter(data);
    }

    const validatedData = validator(data);
    if (!validatedData) {
        return {
            valid: false,
            errors: _parseValidatorErrors(validator.errors, {
                title: schema.title,
                debug: options.debug
            })
        };
    }

    if (validatedData && options.filterReadonly) {
        const readonlyProperties = traverse(schemaObj).reduce(function (memo, value) {
            if (this.key === 'readonly' && value === true) {
                memo.push(this.parent.key);
            }
            return memo;
        }, []);

        traverse(data).forEach(function () {
            if (readonlyProperties.indexOf(this.key) !== -1) {
                this.remove();
            }
        });
    }

    return {
        valid: true
    };
}

export default validate;
