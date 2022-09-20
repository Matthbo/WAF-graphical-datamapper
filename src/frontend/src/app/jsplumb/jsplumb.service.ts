import {Inject, Injectable, Renderer2} from '@angular/core';
import * as jsPlumbBrowserUI from "@jsplumb/browser-ui";
import {AddGroupOptions, Connection, EVENT_CONNECTION, UIGroup} from "@jsplumb/core";
import "@jsplumb/connector-bezier";
import {GroupNode, Node} from "./jsplumb.types";
import {DOCUMENT} from "@angular/common";
import {AnchorSpec} from "@jsplumb/common";

export type AnyObject = { [index:string]: any };

@Injectable({
  providedIn: 'root'
})
export class JsplumbService {

  private _jspInstance?: jsPlumbBrowserUI.BrowserJsPlumbInstance;
  private _inputNode?: GroupNode<HTMLDivElement>;
  private _outputNode?: GroupNode<HTMLDivElement>;

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

    const children = Object.entries(nodeData).map(data => this.prepareNode(data, endpointAlign ?? "Right"));

    return {
      element: nodeElem,
      group,
      children
    }
  }

  private prepareNode([name, data]: [string, any], endpointAlign: AnchorSpec): GroupNode<HTMLElement> | Node<HTMLElement> {
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
        children: Object.entries(data).map(data => this.prepareNode(data, endpointAlign))
      }
    }
    const endpoint = this._jspInstance!.addEndpoint(nodeElem, {
      endpoint: "Dot",
      anchor: endpointAlign,
      source: true,
      target: true,
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
      // const [sourceEndpoint, targetEndpoint] = event.connection.endpoints;

      const overlays = (event.connection as Connection).overlays;
      console.log("Made connection:", overlays, event.target.innerText);

      if (overlays["input-value"] != null) {
        instance.removeOverlay(event.connection, "input-value");
      }
      instance.addOverlay(event.connection, {
        type: "Label", options: {
          // label: EXAMPLE_INPUT[event.target.getAttribute("node-key")],
          label: "endpoint1",
          id: "input-value",
          location: 0.95,
          cssClass: "overlay-label input-overlay",
        }
      });
      instance.addOverlay(event.connection, {
        type: "Label", options: {
          // label: "[*] "+EXAMPLE_INPUT[event.target.getAttribute("node-key")],
          label: "endpoint2",
          id: "output-value",
          location: 0.05,
          cssClass: "overlay-label output-overlay",
          events: {
            click: (event: any, overlay: any) => {
              alert("TODO: open modal")
            }
          }
        },
      });
    });
  });

  addToGroup(group: UIGroup<HTMLElement>, element: HTMLElement){
    this._jspInstance?.addToGroup(group, element);
  }

  reset(){
    this._jspInstance = undefined;
  }

}
