import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsplumbComponent } from './jsplumb/jsplumb.component';
import {DirectivesModule} from "../directives.module";
import { D3Component } from './d3/d3.component';

@NgModule({
  declarations: [
    JsplumbComponent,
    D3Component,
  ],
  imports: [
    CommonModule,
    DirectivesModule
  ]
})
export class ConceptsModule { }
