"use strict";
var RangeValidation = (function () {
    function RangeValidation() {
    }
    RangeValidation.validateLoHi = function (lo, hi) {
        var errors;
        try {
            lo = +lo;
            if (hi !== null) {
                hi = +hi;
                if (hi < lo) {
                    errors = {};
                    errors['loHi'] = { lo: lo, hi: hi };
                }
            }
        }
        catch (err) {
            errors = {};
            errors['notNumber'] = { numbers: "" + lo + " " + hi };
        }
        return errors;
    };
    RangeValidation.validateLoHiObj = function (obj) {
        var lo = obj.lo;
        var hi = obj.hi;
        var errors;
        errors = RangeValidation.validateLoHi(lo, hi);
        // if(errors)
        obj['errors'] = errors;
        return obj;
    };
    return RangeValidation;
}());
exports.RangeValidation = RangeValidation;
//# sourceMappingURL=input-validations.js.map