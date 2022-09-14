import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JsplumbDirective} from "./jsplumb/jsplumb.directive";

@NgModule({
  declarations: [
    JsplumbDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    JsplumbDirective
  ]
})
export class DirectivesModule { }
