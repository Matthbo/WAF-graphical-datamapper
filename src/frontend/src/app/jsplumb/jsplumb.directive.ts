import {Directive, ElementRef, Input} from '@angular/core';
import {AnyObject, JsplumbService} from "./jsplumb.service";

@Directive({
  selector: '[appJsplumb]'
})
export class JsplumbDirective {

  @Input()
  input: AnyObject = {}
  @Input()
  output: AnyObject = {}

  constructor(private container: ElementRef, private jsplumbService: JsplumbService ) {
    console.log("Directive works")
  }

}
