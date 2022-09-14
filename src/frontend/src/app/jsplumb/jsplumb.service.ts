import { Injectable } from '@angular/core';
import * as jsPlumbBrowserUI from "@jsplumb/browser-ui";
import { Connection, EVENT_CONNECTION } from "@jsplumb/core";
import "@jsplumb/connector-bezier";

export type AnyObject = { [index:string]: any };

@Injectable({
  providedIn: 'root'
})
export class JsplumbService {

  private _jspInstance?: jsPlumbBrowserUI.BrowserJsPlumbInstance;
  private _inputValues?: AnyObject;
  private _outputValues?: AnyObject;
  private _inputElem?: HTMLElement;
  private _outputElem?: HTMLElement;

  createInstance(containerElem: HTMLElement, input: AnyObject, output: AnyObject) {
    this._jspInstance = jsPlumbBrowserUI.newInstance({
      container: containerElem,
      dragOptions: {
        containment: jsPlumbBrowserUI.ContainmentType.parent
      }
    });
    this._inputValues = input;
    this._outputValues = output;
    return this._jspInstance;
  }

  prepareNodes(inputEl: HTMLElement, outputEl: HTMLElement){
    this._inputElem = inputEl;
    this._outputElem = outputEl;

    if(this._inputValues && this._outputValues) {
      Object.entries(this._inputValues).forEach(([key, value]) => {
        const newVarElem = document.createElement("div");
        // newVarElem.innerText = `${key}: ${value}`;
        newVarElem.innerText = `${key}: ${typeof value}`;
        newVarElem.classList.add("node");
        newVarElem.setAttribute("node-key", key);
        newVarElem.setAttribute("node-value", value);
        inputEl.appendChild(newVarElem);
      });

      Object.keys(this._outputValues).forEach(value => {
        const newVarElem = document.createElement("div");
        newVarElem.innerText = value;
        newVarElem.classList.add("node");
        outputEl.appendChild(newVarElem);
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
