import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JsplumbDirective} from "./jsplumb/jsplumb.directive";
import {D3Directive} from "./d3/d3.directive";

const directives = [
  JsplumbDirective,
  D3Directive
];

@NgModule({
  declarations: directives,
  imports: [
    CommonModule
  ],
  exports: directives
})
export class DirectivesModule { }
