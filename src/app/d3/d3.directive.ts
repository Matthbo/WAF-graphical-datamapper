import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { D3Service } from './d3.service';
import { AnyObject, SerializableMapping } from './d3.types';

@Directive({
  selector: '[appD3]'
})
export class D3Directive implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  input: AnyObject = {};
  @Input()
  output: AnyObject = {};

  @Output()
  mapping = new EventEmitter<SerializableMapping[]>();

  constructor(
    private container: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private d3Service: D3Service,
    @Inject(DOCUMENT) private document: Document
  ) { console.log("Loaded d3 directive") }

  // TODO prepare DOM and call d3 service to to process data & fill svg

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
