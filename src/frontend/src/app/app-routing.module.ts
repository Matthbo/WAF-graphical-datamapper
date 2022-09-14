import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JsplumbComponent} from "./concepts/jsplumb/jsplumb.component";

const routes: Routes = [
  { path: 'concepts', children: [
      { path: "jsplumb", component: JsplumbComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
