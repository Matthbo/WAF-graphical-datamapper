import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JsplumbComponent} from "./concepts/jsplumb/jsplumb.component";
import {NodeRedComponent} from "./concepts/node-red/node-red.component";

const routes: Routes = [
  { path: '', redirectTo: '/concepts/jsplumb', pathMatch: 'full' },
  { path: 'concepts', children: [
      { path: "jsplumb", component: JsplumbComponent },
      { path: "node-red", component: NodeRedComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
