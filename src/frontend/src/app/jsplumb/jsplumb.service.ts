import {Inject, Injectable, Renderer2} from '@angular/core';
import * as jsPlumbBrowserUI from "@jsplumb/browser-ui";
import {AddGroupOptions, Connection, EVENT_CONNECTION, UIGroup} from "@jsplumb/core";
import "@jsplumb/connector-bezier";
import {GroupNode, Mapping, Node} from "./jsplumb.types";
import {DOCUMENT} from "@angular/common";
import {AnchorSpec} from "@jsplumb/common";

export type AnyObject = { [index:string]: any };
type MockValues = { key: string, value: string, type: string };

@Injectable({
  providedIn: 'root'
})
export class JsplumbService {

  private _jspInstance?: jsPlumbBrowserUI.BrowserJsPlumbInstance;
  private _inputNode?: GroupNode<HTMLDivElement>;
  private _outputNode?: GroupNode<HTMLDivElement>;
  private _mappings?: Mapping<any>[];

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

    const children = Object.entries(nodeData).map(data => this.prepareNode(data, endpointAlign ?? "Right", parentNodeId));

    return {
      element: nodeElem,
      group,
      children
    }
  }

  private prepareNode([name, data]: [string, any], endpointAlign: AnchorSpec, groupId?: string): GroupNode<HTMLElement> | Node<HTMLElement> {
    const nodeElem = document.createElement("div");
    nodeElem.setAttribute("node-key", name);
    nodeElem.setAttribute("node-type", data == null ? "null" : typeof data );
    nodeElem.setAttribute("node-value", data);

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
        group,
        children: Object.entries(data).map(data => this.prepareNode(data, endpointAlign, groupId))
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
      console.log(event);

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

      // TODO register as mapping
      addMapping();
    });
  });

  // TODO get the real nodes
  addMapping(sourceValues: MockValues, targetValues: MockValues){
    sourceValues.type;
    const newMapping: Mapping = {
      sourceNode: {
        parentNode: null, //TODO
        key: sourceValues.key,
        type: sourceValues.type,
        value: sourceValues.value
      },
      targetNode: {

      },
      toSerializable: function(){
        return {
          sourceNode: {
            parentPath: "", // TODO
            key: this.sourceNode.key,
            type: this.sourceNode.type,
            value: this.sourceNode.value
          },
          targetNode: {
            parentPath: "", // TODO
            key: this.targetNode.key,
            type: this.targetNode.type,
            value: this.targetNode.value
          }
        }
      }
    }
  }

  addToGroup(group: UIGroup<HTMLElement>, element: HTMLElement){
    this._jspInstance?.addToGroup(group, element);
  }

  reset(){
    this._jspInstance = undefined;
  }

}
