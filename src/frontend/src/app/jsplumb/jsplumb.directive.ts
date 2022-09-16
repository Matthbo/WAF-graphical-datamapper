import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input, OnDestroy, Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {AnyObject, JsplumbService} from "./jsplumb.service";
import {DOCUMENT} from "@angular/common";

@Directive({
  selector: '[appJsplumb]'
})
export class JsplumbDirective implements AfterViewInit, OnDestroy {

  @Input()
  input: AnyObject = {};
  @Input()
  output: AnyObject = {};

  @Output()
  mapping: AnyObject = {}; // TODO

  constructor(
    private container: ElementRef<HTMLElement>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2,
    private jsplumbService: JsplumbService,
    // @Inject(DOCUMENT) private document: Document
  ) {
    console.log("Directive works")
  }

  ngAfterViewInit() {
    this.viewContainer.clear();

    this.jsplumbService.createInstance(this.container.nativeElement, this.input, this.output);
    // this.jsplumbService.ready(this.jspReady);
  }

  ngOnDestroy() {
    this.jsplumbService.reset();
  }

}
