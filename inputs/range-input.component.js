"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var input_validations_1 = require('./input-validations');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
var EQ = "eq";
var RangeInputComponent = (function () {
    function RangeInputComponent() {
        this._debounceTime = 400;
        this._selectOptions = {
            optionsSelector: EQ,
            lo: null,
            hi: null,
            valid: true
        };
        this._singleSelectOptions = [
            { text: "отдельное значение", sign: "=", value: "eq", selected: true },
            { text: "больше или равно", sign: ">=", value: "ge", selected: null },
            { text: "меньше или равно", sign: "<=", value: "le", selected: null },
            { text: "больше", sign: ">", value: "gt", selected: null },
            { text: "меньше", sign: "<", value: "lt", selected: null },
            { text: "не равно", sign: "<>", value: "ue", selected: null }
        ];
        this._rangeSelectOptions = [
            { text: "интревал", sign: "[ ]", value: "in", selected: true },
            { text: "вне интервала", sign: "] [", value: "out", selected: null }
        ];
        this._optionsList = [EQ];
        this.onChangeCallback = function (_) { };
        this.onTouchedCallback = function () { };
        this.lo = new forms_1.FormControl();
        this.hi = new forms_1.FormControl();
        this.optionsSelector = new forms_1.FormControl();
    }
    RangeInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._optionsList = this._singleSelectOptions;
        this.setInitialSelectOption();
        this.createObservable(this.lo)
            .subscribe(function (val) {
            _this._selectOptions.lo = val;
            // this.onChangeCallback(this._selectOptions);
            _this.callChange(_this._selectOptions);
        });
        this.createObservable(this.hi)
            .subscribe(function (val) {
            if ((val || val === 0) && val.toString().length > 0) {
                if (_this._prevOptionValue == null) {
                    _this._optionsList = _this._rangeSelectOptions;
                    _this._prevOptionValue = val;
                    _this.setInitialSelectOption();
                }
            }
            else if (val == "" || val == null) {
                _this._optionsList = _this._singleSelectOptions;
                _this._prevOptionValue = null;
                _this.setInitialSelectOption();
            }
            _this._selectOptions.hi = val;
            // this.onChangeCallback(this._selectOptions);
            _this.callChange(_this._selectOptions);
        });
        this.createObservable(this.optionsSelector)
            .subscribe(function (val) {
            _this._selectOptions.optionsSelector = val;
            // this.onChangeCallback(this._selectOptions);
            _this.callChange(_this._selectOptions);
        });
    };
    RangeInputComponent.prototype.ngOnChanges = function () {
        // console.log("on changes called");
    };
    RangeInputComponent.prototype.setInitialSelectOption = function () {
        this.optionsSelector.setValue(this._optionsList[0].value);
        this._selectOptions.optionsSelector = this._optionsList[0].value;
    };
    // implementing ControlValueAccessor
    RangeInputComponent.prototype.writeValue = function (value) {
        if (value !== undefined)
            this._selectOptions = Object.assign(this._selectOptions, value);
    };
    RangeInputComponent.prototype.registerOnChange = function (fn) {
        // this.onChangeCallback = fn;
        var that = this;
        this.onChangeCallback = function (arg) {
            //	    	console.log("changes called");
            // let args = Array.prototype.slice.call(arguments)
            // fn.apply(this, args);
            arg = that.validateObj(arg);
            fn(arg);
        };
    };
    RangeInputComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
        // this.onTouchedCallback = ()=>{
        // 	//this.lo.markAsTouched();
        // 	fn()};
    };
    RangeInputComponent.prototype.createObservable = function (formControl) {
        return (formControl.valueChanges
            .debounceTime(this._debounceTime)
            .distinctUntilChanged());
    };
    RangeInputComponent.prototype.validateObj = function (obj) {
        obj = input_validations_1.RangeValidation.validateLoHiObj(obj);
        obj.valid = !obj.errors; // ? false : true;
        return obj;
    };
    RangeInputComponent.prototype.callChange = function (selOptions) {
        this._selectOptions = Object.assign(new SelectOptions(), selOptions);
        this.onChangeCallback(this._selectOptions);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', SelectOptions)
    ], RangeInputComponent.prototype, "_selectOptions", void 0);
    RangeInputComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'rangeInput',
            template: "\n\t\t<div class=\"form-group\" [class.has-error]=\"this._selectOptions.errors\">\n\t\t\t<select class=\"form-control\" [formControl]=\"optionsSelector\">\n\t\t\t\t<option *ngFor=\"let op of _optionsList\" value=\"{{ op.value }}\" \n\t\t\t\t\t\t[attr.selected]=\"op.selected\">{{ op.sign }}</option>\n\t\t\t</select>\n\t\t\t<input type=\"number\" name=\"lo\" class=\"range-low form-control\" [formControl]=\"lo\" />\n\t\t\t<input type=\"number\" name=\"hi\" class=\"range-high form-control\" [formControl]=\"hi\" />\n\t\t</div>\t\t\n\t",
            styles: [
                "\n\t\tselect {\n\t\t\t-webkit-appearance: none;\n    \t\t-moz-appearance: none;\n\t\t\tpadding-right: 15px;\n\t\t\tpadding-left: 5px;\n\t\t\tfont-weight: bold;\n\t\t}\n\n\t\tselect::-ms-expand {\n\t    \tdisplay: none;\n\t\t}\n\n\t\t.form-group {\n\t\t\tdisplay: inline-block;\n    \t\tmargin-bottom: 0;\n    \t\tvertical-align: middle;\n    \t\tmargin-left: 5px;\n    \t\tmargin-right: 5px;\n\t\t}\n\n\t\t.form-group .form-control {\n\t\t\tdisplay: inline-block;\n    \t\twidth: auto;\n    \t\tvertical-align: middle;\n\t\t}\n\t\t"
            ],
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return RangeInputComponent; }),
                    multi: true
                }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], RangeInputComponent);
    return RangeInputComponent;
}());
exports.RangeInputComponent = RangeInputComponent;
var SelectOptions = (function () {
    function SelectOptions() {
        this.optionsSelector = EQ;
        this.lo = null;
        this.hi = null;
        this.valid = true;
    }
    return SelectOptions;
}());
//# sourceMappingURL=range-input.component.js.map