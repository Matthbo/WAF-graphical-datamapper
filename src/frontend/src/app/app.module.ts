import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ConceptsModule} from "./concepts/concepts.module";
import { JsplumbDirective } from './jsplumb/jsplumb.directive';
import {DirectivesModule} from "./directives.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ConceptsModule,
    BrowserModule,
    AppRoutingModule,
    DirectivesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
