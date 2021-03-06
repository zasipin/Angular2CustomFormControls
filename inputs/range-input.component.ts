import { Component, OnInit, forwardRef, Input, OnChanges } from '@angular/core';
import { FormControl, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RangeValidation } from './input-validations';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const EQ = "eq";

@Component({
	moduleId: module.id,
	selector: 'rangeInput',
	template: `
		<div class="form-group" [class.has-error]="this._selectOptions.errors">
			<select class="form-control" [formControl]="optionsSelector">
				<option *ngFor="let op of _optionsList" value="{{ op.value }}" 
						[attr.selected]="op.selected">{{ op.sign }}</option>
			</select>
			<input type="number" name="lo" class="range-low form-control" [formControl]="lo" />
			<input type="number" name="hi" class="range-high form-control" [formControl]="hi" />
		</div>		
	`,
	styles:[
		`
		select {
			-webkit-appearance: none;
    		-moz-appearance: none;
			padding-right: 15px;
			padding-left: 5px;
			font-weight: bold;
		}

		select::-ms-expand {
	    	display: none;
		}

		.form-group {
			display: inline-block;
    		margin-bottom: 0;
    		vertical-align: middle;
    		margin-left: 5px;
    		margin-right: 5px;
		}

		.form-group .form-control {
			display: inline-block;
    		width: auto;
    		vertical-align: middle;
		}
		`
	],
	providers: [
		{ 
		    provide: NG_VALUE_ACCESSOR,
		    useExisting: forwardRef(() => RangeInputComponent),
		    multi: true
	    }
	]
})
export class RangeInputComponent implements OnInit, ControlValueAccessor, OnChanges {

	private lo: AbstractControl;
	private hi: AbstractControl;
	private optionsSelector: AbstractControl;

	private _debounceTime = 400;
	
	@Input()
	_selectOptions: SelectOptions = {
		optionsSelector: EQ,
		lo: null,
		hi: null,
		valid: true
	};

	private _singleSelectOptions = [
			{ text: "отдельное значение", 	sign: "=", 	value: "eq", selected: true },
			{ text: "больше или равно", 	sign: ">=", value: "ge", selected: null },
			{ text: "меньше или равно", 	sign: "<=", value: "le", selected: null },
			{ text: "больше", 				sign: ">", 	value: "gt", selected: null },
			{ text: "меньше", 				sign: "<", 	value: "lt", selected: null },
			{ text: "не равно", 			sign: "<>", value: "ue", selected: null }

		];
	private _rangeSelectOptions = [
			{ text: "интревал", 			sign: "[ ]", value: "in", 	selected: true },
			{ text: "вне интервала", 		sign: "] [", value: "out", 	selected: null }
		];
	private _prevOptionValue;	

	private _optionsList: Array<any> = [ EQ ];	

	constructor() {
		this.lo = new FormControl();
		this.hi = new FormControl();
		this.optionsSelector = new FormControl();
	}

	ngOnInit() {
		this._optionsList = this._singleSelectOptions;	
		this.setInitialSelectOption();

		this.createObservable(this.lo)
			.subscribe((val) => {
				this._selectOptions.lo = val;
				// this.onChangeCallback(this._selectOptions);
				this.callChange(this._selectOptions);
			});
		
		this.createObservable(this.hi)
			.subscribe((val) => { 
				if((val || val === 0) && val.toString().length > 0)
				{
					if(this._prevOptionValue == null)
					{	
						this._optionsList = this._rangeSelectOptions;
						this._prevOptionValue = val;
						this.setInitialSelectOption();
					}
				}
				else if(val == "" || val == null)
				{
					this._optionsList = this._singleSelectOptions;	
					this._prevOptionValue = null;
					this.setInitialSelectOption();
				}

				this._selectOptions.hi = val;
				// this.onChangeCallback(this._selectOptions);
				this.callChange(this._selectOptions);
			});
		
		this.createObservable(this.optionsSelector)
			.subscribe((val) => {
				this._selectOptions.optionsSelector = val;
				// this.onChangeCallback(this._selectOptions);
				this.callChange(this._selectOptions);
			});
	}

	ngOnChanges() {
		// console.log("on changes called");
	}	

	private setInitialSelectOption()
	{
		this.optionsSelector.setValue(this._optionsList[0].value);
		this._selectOptions.optionsSelector = this._optionsList[0].value;
	}

	// implementing ControlValueAccessor
	writeValue(value: any) {
		if(value !== undefined)
    		this._selectOptions = Object.assign(this._selectOptions, value);
  	}

  	private onChangeCallback = (_: any) => {};
  	private onTouchedCallback = () => {};

	registerOnChange(fn) {
	    // this.onChangeCallback = fn;
	    let that = this;
	    this.onChangeCallback = function(arg) {
//	    	console.log("changes called");
	    	// let args = Array.prototype.slice.call(arguments)
	    	// fn.apply(this, args);

	    	arg = that.validateObj(arg);
	    	fn(arg);
	    };
	  }

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
        // this.onTouchedCallback = ()=>{
        // 	//this.lo.markAsTouched();
        // 	fn()};
    }

    private createObservable(formControl: AbstractControl) {
    	return (formControl.valueChanges
    			.debounceTime(this._debounceTime)
				.distinctUntilChanged());
    }

    private validateObj(obj) {
		obj = RangeValidation.validateLoHiObj(obj);
		obj.valid = !obj.errors;// ? false : true;
		return obj;
    }

    private callChange(selOptions: SelectOptions) {
    	this._selectOptions = Object.assign(new SelectOptions(), selOptions);
    	this.onChangeCallback(this._selectOptions);
    }
}

class SelectOptions {
		optionsSelector = EQ;
		lo = null;
		hi = null;
		valid = true
}
