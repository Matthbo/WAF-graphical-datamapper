import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Directive, DoCheck, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { D3Service } from './d3.service';
import { AnyObject, SerializableMapping } from './d3.types';

@Directive({
  selector: 'svg[appD3]'
})
export class D3Directive implements AfterViewInit, OnDestroy {

  @Input()
  input: AnyObject = {};
  @Input()
  output: AnyObject = {};

  @Output()
  mapping = new EventEmitter<SerializableMapping[]>();

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
    const inputCluster = this.d3Service.createCluster(inputData, clusterWidth, svgHeight);
    this.d3Service.generateCluster(inputCluster, inputElem, clusterWidth, 40, 0, false);
    const outputCluster = this.d3Service.createCluster(outputData, clusterWidth, svgHeight);
    this.d3Service.generateCluster(outputCluster, outputElem, clusterWidth, svgWidth / 2 + 160, 0, true);
  
    this.d3Service.updateMappingsEvent.subscribe((mappings: SerializableMapping[]) => {
      this.mapping.emit(mappings);
    });
  }

  onResize() {
    console.log("resized");
  }

  ngOnDestroy(): void {
    this.d3Service.reset();
  }

}
