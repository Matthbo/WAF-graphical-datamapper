import {
  AfterViewInit,
  Directive,
  ElementRef, EventEmitter,
  Inject,
  Input, OnDestroy, OnInit, Output,
  Renderer2,
} from '@angular/core';
import {AnyObject, JsplumbService} from "./jsplumb.service";
import {DOCUMENT} from "@angular/common";
import {GroupNode, Mapping, Node} from "./jsplumb.types";
import {UIGroup} from "@jsplumb/core";
import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";

@Directive({
  selector: '[appJsplumb]',

})
export class JsplumbDirective implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  input: AnyObject = {};
  @Input()
  output: AnyObject = {};

  @Output()
  mapping = new EventEmitter<Mapping[]>(); // TODO

  constructor(
    private container: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private jsplumbService: JsplumbService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const containerElem = this.container.nativeElement;
    containerElem.innerText = "";
    this.jsplumbService.createInstance(containerElem, this.input, this.output);

    this.jsplumbService.ready(() => this.onReady());

    // this.jsplumbService.updateMappingsEvent.subscribe((mappings: Mapping[]) => this.mapping.emit(mappings));
    this.jsplumbService.updateMappingsEvent.subscribe((mappings: Mapping[]) => {
      console.log("service mappings trigger");
      this.mapping.emit(mappings);
    });
  }

  onReady(){
    const containerElem = this.container.nativeElement;

    this.renderNodes(this.jsplumbService.inputNode, containerElem, undefined, "Input");
    this.renderNodes(this.jsplumbService.outputNode, containerElem, undefined, "Output");

    const inputNode = document.querySelector<HTMLDivElement>("#input-node")!;
    inputNode.style.top = `${(containerElem.clientHeight-inputNode.clientHeight)/2}px`;
    inputNode.style.left = `${(containerElem.clientWidth-inputNode.clientWidth)/4}px`;
    const outputNode = document.querySelector<HTMLDivElement>("#output-node")!;
    outputNode.style.top = `${(containerElem.clientHeight-outputNode.clientHeight)/2}px`;
    outputNode.style.left = `${(containerElem.clientWidth-outputNode.clientWidth)/4*3}px`;
  }

  renderNodes(groupNode: GroupNode<HTMLElement>, parentElem: HTMLElement, parentGroup?: UIGroup<HTMLElement>, title?: string) {
    const { element, group, children } = groupNode;

    if(parentGroup){ // Child group nodes
      this.jsplumbService.addToGroup(parentGroup, element);
      element.innerText = `${element.getAttribute("node-key")}: ${element.getAttribute("node-type")}`;
      element.classList.add("group-node", "node");
    } else { // Base groups
      const titleElem = document.createElement("p");
      titleElem.classList.add("title");
      titleElem.innerText = title ?? "Group";
      element.classList.add("base-group-node");
      element.id = `${title?.toLowerCase()}-node`;
      element.insertBefore(titleElem, element.firstChild);
    }

    children.forEach(child => {
      if(child.hasOwnProperty("endpoint")){
        this.renderNode(child as Node<HTMLElement>, element, group);
        return;
      }
      this.renderNodes(child as GroupNode<HTMLElement>, element, group);
    });

    this.renderer.appendChild(parentElem, element);
  }

  renderNode(node: Node<HTMLElement>, parentElem: HTMLElement, group: UIGroup<HTMLElement>){
    const { element, endpoint } = node;
    this.jsplumbService.addToGroup(group, element);
    endpoint.connector = {
      type: "Bezier",
      options: {
        cornerRadius: 3,
      }
    };
    element.innerText = `${element.getAttribute("node-key")}: ${element.getAttribute("node-type")}`;
    element.classList.add("node");
    this.renderer.appendChild(parentElem, element);
  }

  ngOnDestroy() {
    this.jsplumbService.reset();
  }

}
