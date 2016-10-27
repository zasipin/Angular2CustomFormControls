import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RangeInputComponent } from './range-input.component';

@NgModule({
	imports: [ CommonModule, ReactiveFormsModule ],
	exports: [ RangeInputComponent ],
	declarations: [ RangeInputComponent ],
	providers: []
})
export class InputsModule {}