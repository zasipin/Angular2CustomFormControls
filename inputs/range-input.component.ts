import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { FormControl, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	moduleId: module.id,
	selector: 'rangeInput',
	template: `
		<div class="form-group">
			<select class="form-control" [formControl]="optionsSelector">
				<option *ngFor="let op of _optionsList" value="{{ op.value }}" 
						selected="{{ op.selected }}">{{ op.sign }}</option>
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
export class RangeInputComponent implements OnInit, ControlValueAccessor {
	
	private lo: AbstractControl;
	private hi: AbstractControl;
	private optionsSelector: AbstractControl;

	private _debounceTime = 400;
	
	@Input()
	_selectOptions = {
		optionsSelector: "eq",
		lo: "",
		hi: ""
	};

	private _singleSelectOptions = [
			{ text: "отдельное значение", 	sign: "=", 	value: "eq", selected: "selected" },
			{ text: "больше или равно", 	sign: ">=", value: "ge", selected: "" },
			{ text: "меньше или равно", 	sign: "<=", value: "le", selected: "" },
			{ text: "больше", 				sign: ">", 	value: "gt", selected: "" },
			{ text: "меньше", 				sign: "<", 	value: "lt", selected: "" },
			{ text: "не равно", 			sign: "<>", value: "ue", selected: "" }

		];
	private _rangeSelectOptions = [
			{ text: "интревал", 			sign: "[ ]", value: "in", 	selected: "selected" },
			{ text: "вне интервала", 		sign: "] [", value: "out", 	selected: "" }
		];
	private _optionValue;	

	private _optionsList: Array<any>;	

	constructor() {
		this.lo = new FormControl();
		this.hi = new FormControl();
		this.optionsSelector = new FormControl();
	}

	ngOnInit() {
		this._optionsList = this._singleSelectOptions;	

		this.createObservable(this.lo)
			.subscribe((val) => {
				this._selectOptions.lo = val;
				this.onChangeCallback(this._selectOptions);
			});
		
		this.createObservable(this.hi)
			.subscribe((val) => { 
				if(this._optionValue === null)
					this._optionValue = this._optionsList[0].value;

				if(val && val.toString().length > 0)
					this._optionsList = this._rangeSelectOptions;
				else if(val == "" || val == null)
				{
					this._optionsList = this._singleSelectOptions;	
					this._optionValue = null;
				}

				this._selectOptions.hi = val;
				// this._selectOptions.optionsSelector = this.optionsSelector.value || this._optionsList[0].value;
				this._selectOptions.optionsSelector = this._optionValue || this._optionsList[0].value;
				this.onChangeCallback(this._selectOptions);
			});
		
		this.createObservable(this.optionsSelector)
			.subscribe((val) => {
				this._optionValue = val;
				this._selectOptions.optionsSelector = val;
				this.onChangeCallback(this._selectOptions);
			});
	}

	// implementing ControlValueAccessor
	writeValue(value: any) {
		if(value !== undefined)
    		this._selectOptions = Object.assign(this._selectOptions, value);
  	}

  	private onChangeCallback = (_: any) => {};
  	private onTouchedCallback = () => {};

	registerOnChange(fn) {
	    this.onChangeCallback = fn;
	  }

	registerOnTouched(fn: any) {
        this.onTouchedCallback = ()=>{
        	//this.lo.markAsTouched();
        	fn()};
    }

    private createObservable(formControl: AbstractControl) {
    	return (formControl.valueChanges
    			.debounceTime(this._debounceTime)
				.distinctUntilChanged());
    }
}