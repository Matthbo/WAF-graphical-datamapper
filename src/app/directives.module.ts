import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JsplumbDirective} from "./jsplumb/jsplumb.directive";
import {D3Directive} from "./d3/d3.directive";

@NgModule({
  declarations: [
    JsplumbDirective,
    D3Directive
  ],
  imports: [
    CommonModule
  ],
  exports: [
    JsplumbDirective
  ]
})
export class DirectivesModule { }
