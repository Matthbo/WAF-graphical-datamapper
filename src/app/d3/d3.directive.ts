import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { D3Service } from './d3.service';
import { AnyObject, CustomisationOptions, Mappable } from './d3.types';

@Directive({
  selector: 'svg[appD3]'
})
export class D3Directive implements AfterViewInit, OnDestroy, OnChanges {

  @Input()
  input: AnyObject = {};
  @Input()
  output: AnyObject = {};

  @Input()
  customisation!: CustomisationOptions;
  @Output()
  customisationChange = new EventEmitter<CustomisationOptions>;

  @Output()
  mapping = new EventEmitter<Mappable[]>();

  constructor(
    private container: ElementRef<SVGElement>,
    private renderer: Renderer2,
    private d3Service: D3Service,
    @Inject(DOCUMENT) private document: Document
  ) {
    document.defaultView!.addEventListener("resize", this.onResize);
  }

  createChildElement<K extends keyof SVGElementTagNameMap>(parent: Element, tagName: K, classAttr: string) {
    const child = this.document.createElementNS<K>("http://www.w3.org/2000/svg", tagName);
    child.setAttribute("class", classAttr);
    this.renderer.appendChild(parent, child);
    return child;
  }

  ngAfterViewInit(): void {
    const containerElem = this.container.nativeElement;
    containerElem.innerHTML = "";
    const svgWidth = containerElem.clientWidth;
    const svgHeight = containerElem.clientHeight;

    this.createChildElement(containerElem, "g", "connections");
    const inputElem = this.createChildElement(containerElem, "g", "input-node");
    this.createChildElement(inputElem, "g", "links");
    this.createChildElement(inputElem, "g", "nodes");
    this.createChildElement(inputElem, "g", "overlay");
    const outputElem = this.createChildElement(containerElem, "g", "output-node");
    this.createChildElement(outputElem, "g", "links");
    this.createChildElement(outputElem, "g", "nodes");
    this.createChildElement(outputElem, "g", "overlay");

    const inputData = this.d3Service.convertData("input", this.input);
    const outputData = this.d3Service.convertData("output", this.output);

    // TODO resize on window resize
    const clusterWidth = svgWidth / 2 - 200;

    const generateInputCluster = this.d3Service.generateCluster(inputData, clusterWidth, svgHeight);
    generateInputCluster(inputElem, 40, 0, false);

    const generateOutputCluster = this.d3Service.generateCluster(outputData, clusterWidth, svgHeight);
    generateOutputCluster(outputElem, svgWidth / 2 + 160, 0, true);

    this.d3Service.test(this.d3Service.iconPlus);

    this.d3Service.updateMappingsEvent.subscribe((mappings: Mappable[]) => {
      this.mapping.emit(mappings);
    });
  }

  onResize() {
    console.log("resized");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["customisation"] && changes["customisation"].currentValue != null) {
      console.log(changes["customisation"])
      const optionsChange = this.d3Service.setCustomisation(this.customisation);
      // this.customisationChange.emit(optionsChange);
    }
  }

  ngOnDestroy(): void {
    this.d3Service.reset();
  }

}
