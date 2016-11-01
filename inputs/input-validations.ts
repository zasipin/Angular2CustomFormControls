export class RangeValidation {
	static validateLoHi(lo, hi){
		let errors;
		try{
			// lo = +lo;
			if(lo !== null) {
				if(hi !== null) {
					hi = +hi;
					if( hi < lo) {
						errors = errors || {};
						errors['loHi'] = { lo: lo, hi: hi };
					}
				} 
			} 
			if(lo === null && hi !== null) {
				errors = errors || {};
				errors['noLo'] = { lo: lo, hi: hi };
			}
		}
		catch (err) {
			errors = errors || {};
			errors['notNumber'] = { numbers: "" + lo + " " + hi };
		}
		return errors;
	}

	static validateLoHiObj(obj){
		let lo = obj.lo;
		let hi = obj.hi;
		let errors;
		errors = RangeValidation.validateLoHi(lo, hi);
		// if(errors)
		obj.errors = errors;
		return obj;
	}

}