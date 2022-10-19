import {EventEmitter, Inject, Injectable, Renderer2} from '@angular/core';
import * as jsPlumbBrowserUI from "@jsplumb/browser-ui";
import {AddGroupOptions, Connection, EVENT_CONNECTION, UIGroup} from "@jsplumb/core";
import "@jsplumb/connector-bezier";
import {GroupNode, Mapping, Node} from "./jsplumb.types";
import {DOCUMENT} from "@angular/common";
import {AnchorSpec} from "@jsplumb/common";

export type AnyObject = { [index:string]: any };
type MockValues = { key: string, type: string, path: string };

@Injectable({
  providedIn: 'root'
})
export class JsplumbService {

  private _jspInstance?: jsPlumbBrowserUI.BrowserJsPlumbInstance;
  private _inputNode?: GroupNode<HTMLDivElement>;
  private _outputNode?: GroupNode<HTMLDivElement>;
  private _mappings: Mapping[] = [];

  public updateMappingsEvent= new EventEmitter<Mapping[]>();

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  get inputNode(){
    return { ...this._inputNode! };
  }

  get outputNode(){
    return { ...this._outputNode! };
  }

  createInstance(containerElem: HTMLElement, input: AnyObject, output: AnyObject){
    this._jspInstance = jsPlumbBrowserUI.newInstance({
      container: containerElem,
      dragOptions: {
        containment: jsPlumbBrowserUI.ContainmentType.parent
      }
    });

    this._inputNode = this.prepareNodes(input, "inputNode", "Right");
    this._outputNode = this.prepareNodes(output, "outputNode", "Left");
  }

  private prepareNodes(nodeData: AnyObject, parentNodeId?: string, endpointAlign?: AnchorSpec): GroupNode<HTMLDivElement>
  {
    const nodeElem = document.createElement("div");
    const group = this._jspInstance!.addGroup({
      el: nodeElem,
      id: parentNodeId,
      droppable: false,
      constrain: true,
      dropOverride: true,
    }) as UIGroup<HTMLDivElement>

    const basePath = "/"

    const children = Object.entries(nodeData).map(data => this.prepareNode(data, endpointAlign ?? "Right", basePath, parentNodeId));

    return {
      element: nodeElem,
      path: basePath,
      group,
      children
    }
  }

  private prepareNode([name, data]: [string, any], endpointAlign: AnchorSpec, path: string, groupId?: string): GroupNode<HTMLElement> | Node<HTMLElement> {
    const nodeElem = document.createElement("div");
    nodeElem.setAttribute("node-key", name);
    nodeElem.setAttribute("node-type", data == null ? "null" : typeof data );
    nodeElem.setAttribute("node-value", data);
    nodeElem.setAttribute("node-path", path);

    const deeperPath = path === "/" ? path+name : `${path}/${name}`;

    if(typeof data === "object" && data !== null){
      const group = this._jspInstance!.addGroup({
        el: nodeElem,
        // id: "inputNode",
        droppable: false,
        constrain: true,
        dropOverride: true,
      }) as UIGroup<HTMLDivElement>

      return {
        element: nodeElem,
        path: deeperPath,
        group,
        children: Object.entries(data).map(data => this.prepareNode(data, endpointAlign, deeperPath, groupId))
      }
    }
    const endpoint = this._jspInstance!.addEndpoint(nodeElem, {
      endpoint: "Dot",
      anchor: endpointAlign,
      source: true,
      target: true,
      parameters: { groupId }
    });

    return {
      element: nodeElem,
      path: deeperPath,
      endpoint
    }
  }

  ready = (readyFn: Function) => jsPlumbBrowserUI.ready(() => {
    const instance = this._jspInstance!;
    instance.batch(() => readyFn());

    instance.bind(jsPlumbBrowserUI.EVENT_CONNECTION_CLICK, (connection: Connection) => {
      console.log("Click:", connection);
    });

    instance.bind(EVENT_CONNECTION, (event) => {
      const [sourceEndpoint, targetEndpoint] = event.connection.endpoints;
      // console.log(event);

      const overlays = (event.connection as Connection).overlays;
      const overlayKeys = Object.keys(overlays);

      // console.log("Made connection:", overlays, event.target.innerText);
      overlayKeys.forEach(key => instance.removeOverlay(event.connection, key));

      const sourceIsInput = sourceEndpoint.parameters.groupId === "inputNode",
        inputOverlayLocation = 0.05,
        outputOverlayLocation = 0.95,
        inputValue = sourceIsInput ? event.source.getAttribute("node-value") : event.target.getAttribute("node-value");

      // Source overlay
      instance.addOverlay(event.connection, {
        type: "Label", options: {
          // label: "[*] "+EXAMPLE_INPUT[event.target.getAttribute("node-key")],
          label: inputValue,
          // id: "output-value",
          location: sourceIsInput ? inputOverlayLocation : outputOverlayLocation,
          cssClass: "overlay-label input-overlay"
        },
      });

      // Target overlay
      instance.addOverlay(event.connection, {
        type: "Label", options: {
          // label: EXAMPLE_INPUT[event.target.getAttribute("node-key")],
          label: `[*] ${inputValue}`,
          // id: "input-value",
          location: sourceIsInput ? outputOverlayLocation : inputOverlayLocation,
          cssClass: "overlay-label output-overlay",
          events: {
            click: (event: any, overlay: any) => {
              alert("TODO: open modal")
            }
          }
        }
      });

      const sourceVals: MockValues = { key: event.source.getAttribute("node-key"), type: event.source.getAttribute("node-type"), path: event.source.getAttribute("node-path") };
      const targetVals: MockValues = { key: event.target.getAttribute("node-key"), type: event.target.getAttribute("node-type"), path: event.target.getAttribute("node-path") };
      sourceIsInput ? this.addMapping(sourceVals, targetVals) : this.addMapping(targetVals, sourceVals);
    });
  });

  // TODO get from the real nodes (this._inputNode & this._outputNode)
  addMapping(inputValues: MockValues, outputValues: MockValues){
    const newMapping: Mapping = {
      sourceNode: {
        parentNode: null, //TODO
        key: inputValues.key,
        type: inputValues.type,
      },
      targetNode: {
        parentNode: null, //TODO
        key: outputValues.key,
        type: outputValues.type,
      },
      toSerializable: function(){
        return {
          sourceNode: {
            parentPath: inputValues.path,
            key: this.sourceNode.key,
            type: this.sourceNode.type,
          },
          targetNode: {
            parentPath: outputValues.path,
            key: this.targetNode.key,
            type: this.targetNode.type,
          }
        }
      }
    }
    this._mappings.push(newMapping);
    this.updateMappingsEvent.emit(this._mappings);
  }

  addToGroup(group: UIGroup<HTMLElement>, element: HTMLElement){
    this._jspInstance?.addToGroup(group, element);
  }

  reset(){
    delete this._jspInstance;
    delete this._inputNode;
    delete this._outputNode;
    this._mappings = [];
  }

}
