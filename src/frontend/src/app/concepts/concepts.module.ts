import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsplumbComponent } from './jsplumb/jsplumb.component';
import { NodeRedComponent } from './node-red/node-red.component';
import {AppModule} from "../app.module";
import {JsplumbDirective} from "../jsplumb/jsplumb.directive";
import {DirectivesModule} from "../directives.module";

@NgModule({
  declarations: [
    JsplumbComponent,
    NodeRedComponent,
    // JsplumbDirective
  ],
  imports: [
    CommonModule,
    DirectivesModule
  ]
})
export class ConceptsModule { }
