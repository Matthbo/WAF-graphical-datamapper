import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JsplumbComponent} from "./concepts/jsplumb/jsplumb.component";
import {D3Component} from "./concepts/d3/d3.component";

const routes: Routes = [
  { path: '', redirectTo: '/concepts/jsplumb', pathMatch: 'full' },
  { path: 'concepts', children: [
      { path: "jsplumb", component: JsplumbComponent },
      { path: "d3", component: D3Component },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
