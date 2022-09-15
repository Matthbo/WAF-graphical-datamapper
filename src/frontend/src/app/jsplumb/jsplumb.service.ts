import {Injectable, Renderer2} from '@angular/core';
import * as jsPlumbBrowserUI from "@jsplumb/browser-ui";
import { Connection, EVENT_CONNECTION } from "@jsplumb/core";
import "@jsplumb/connector-bezier";

export type AnyObject = { [index:string]: any };

@Injectable({
  providedIn: 'root'
})
export class JsplumbService {

  private _renderer?: Renderer2;
  private _jspInstance?: jsPlumbBrowserUI.BrowserJsPlumbInstance;
  private _inputValues?: AnyObject;
  private _outputValues?: AnyObject;
  private _inputElem?: HTMLElement;
  private _outputElem?: HTMLElement;

  createInstance(renderer: Renderer2, containerElem: HTMLElement, input: AnyObject, output: AnyObject) {
    this._renderer = renderer;
    this._jspInstance = jsPlumbBrowserUI.newInstance({
      container: containerElem,
      dragOptions: {
        containment: jsPlumbBrowserUI.ContainmentType.parent
      }
    });
    this._inputValues = input;
    this._outputValues = output;

    containerElem.classList.add("jsp-container");
    this.prepareNodes(containerElem);

    // return this._jspInstance;
    return containerElem;
  }

  prepareNodes(containerElem: HTMLElement){
    const inputElem = document.createElement("div");
    inputElem.id = "input-node";
    inputElem.classList.add("group-node");
    // containerElem.appendChild(inputElem);
    this._renderer!.appendChild(containerElem, inputElem);
    const outputElem = document.createElement("div");
    outputElem.id = "output-node";
    outputElem.classList.add("group-node");
    // containerElem.appendChild(outputElem);
    this._renderer!.appendChild(containerElem, outputElem);

    this._inputElem = inputElem;
    this._outputElem = outputElem;

    if(this._inputValues && this._outputValues) {
      Object.entries(this._inputValues).forEach(([key, value]) => {
        const newVarElem = document.createElement("div");
        // newVarElem.innerText = `${key}: ${value}`;
        newVarElem.innerText = `${key}: ${typeof value}`;
        newVarElem.classList.add("node");
        newVarElem.setAttribute("node-key", key);
        newVarElem.setAttribute("node-value", value);
        inputElem.appendChild(newVarElem);
      });

      Object.keys(this._outputValues).forEach(value => {
        const newVarElem = document.createElement("div");
        newVarElem.innerText = value;
        newVarElem.classList.add("node");
        outputElem.appendChild(newVarElem);
      });

      return;
    }
     console.error("Preparing nodes failed: input and output values not set");
  }

  ready = (readyFn: Function) => jsPlumbBrowserUI.ready(() => {
      this._jspInstance?.batch(() => {
        if(this._jspInstance && this._inputElem && this._outputElem) {
          const inputNode = this._jspInstance?.addGroup({
            el: this._inputElem,
            id: "inputNode",
            droppable: false,
            constrain: true,
            dropOverride: true,
          });

          Array.from(this._inputElem.querySelectorAll<HTMLDivElement>(":not(.title)")).forEach(child => {
            this._jspInstance?.addToGroup(inputNode, child);
            this._jspInstance?.addEndpoint(child, {
              endpoint: "Dot",
              anchor: "Right",
              target: true,
              // reattachConnections: true
              // ...inOutConnectorEndpointOptions(child)
            });
          });

          const outputNode = this._jspInstance?.addGroup({
            el: this._outputElem,
            id: "outputNode",
            droppable: false,
            constrain: true,
            dropOverride: true,

          });

          Array.from(this._outputElem.querySelectorAll<HTMLDivElement>(":not(.title)")).forEach(child => {
            this._jspInstance?.addToGroup(outputNode, child);
            this._jspInstance?.addEndpoint(child, {
              endpoint: "Dot",
              anchor: "Left",
              source: true,
              // ...inOutConnectorEndpointOptions(child),
              connector: {
                type: "Bezier",
                options: {
                  cornerRadius: 3,
                }
              }
            });
          });
        }
      });

    readyFn();
  });

}
