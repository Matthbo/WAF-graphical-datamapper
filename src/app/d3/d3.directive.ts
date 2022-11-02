import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
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
  ) {}

  createChildElement<K extends keyof SVGElementTagNameMap>(parent: Element, tagName: K, classAttr: string) {
    const child = this.document.createElementNS<K>("http://www.w3.org/2000/svg", tagName);
    child.setAttribute("class", classAttr);
    this.renderer.appendChild(parent, child);
    return child;
  }

  private testSVGCursor(event: MouseEvent){
    const svg = this.container.nativeElement as SVGSVGElement;

    // @ts-ignore
    const pt = svg.createSVGPoint();
    pt.x = event.clientX; pt.y = event.clientY;
    const svgCoords = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    console.log(svgCoords)
  }

  ngAfterViewInit(): void {
    const containerElem = this.container.nativeElement;
    containerElem.innerHTML = "";

    const connectionsElem = this.createChildElement(containerElem, "g", "connections");
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

    // TODO get correct width and height
    const inputCluster = this.d3Service.createCluster(inputData, 300, 720);
    this.d3Service.generateCluster(inputCluster, inputElem, 300, 20, 0, false);

    const outputCluster = this.d3Service.createCluster(outputData, 300, 720);
    this.d3Service.generateCluster(outputCluster, outputElem, 300, 496, 0, true);
  
    containerElem.onclick = this.testSVGCursor.bind(this);
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
