import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {AnyObject, JsplumbService} from "./jsplumb.service";
import {DOCUMENT} from "@angular/common";

@Directive({
  selector: '[appJsplumb]'
})
export class JsplumbDirective implements AfterViewInit {

  @Input()
  input: AnyObject = {}
  @Input()
  output: AnyObject = {}

  constructor(private container: ElementRef<HTMLElement>, private viewContainer: ViewContainerRef, private renderer: Renderer2, private jsplumbService: JsplumbService,
              @Inject(DOCUMENT) private document: Document) {
    const child = document.createElement('div');
    this.renderer.appendChild(this.container.nativeElement, child);
    console.log("Directive works")
  }

  ngAfterViewInit() {
    console.log("Input & output", this.input, this.output)

    this.jsplumbService.createInstance(this.renderer, this.container.nativeElement, this.input, this.output);
    // this.jsplumbService.prepareNodes(this._inputNode.nativeElement, this._outputNode.nativeElement);
    // this.jsplumbService.ready(this.jspReady);
    this.viewContainer.element.nativeElement = this.container.nativeElement;
    // this.viewContainer.clear();
  }

}
