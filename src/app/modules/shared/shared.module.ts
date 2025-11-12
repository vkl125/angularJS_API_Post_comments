import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//for shared components such as ButtonComponent, CheckboxComponent, RadioButtonComponent, DropdownComponent, ModalComponent, etc.
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ]
})
export class SharedModule { }