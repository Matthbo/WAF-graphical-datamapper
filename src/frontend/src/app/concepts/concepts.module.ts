import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsplumbComponent } from './jsplumb/jsplumb.component';
import { NodeRedComponent } from './node-red/node-red.component';

@NgModule({
  declarations: [
    JsplumbComponent,
    NodeRedComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ConceptsModule { }
