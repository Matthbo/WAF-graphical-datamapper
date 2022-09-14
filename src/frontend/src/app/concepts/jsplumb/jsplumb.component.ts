import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {JsplumbService} from "../../jsplumb/jsplumb.service";


@Component({
  selector: 'app-jsplumb',
  templateUrl: './jsplumb.component.html',
  styleUrls: ['./jsplumb.component.scss']
})
export class JsplumbComponent implements AfterViewInit {

  @ViewChild("container")
  private _container!: ElementRef<HTMLDivElement>;
  @ViewChild("inputNode")
  private _inputNode!: ElementRef<HTMLDivElement>;
  @ViewChild("outputNode")
  private _outputNode!: ElementRef<HTMLDivElement>;

  private EXAMPLE_INPUT: { [index:string]: any } = {
    name: "example",
    value: "input",
    id: 1,
    active: true,
    object: {
      name: "recursive",
      value: "input 2"
    }
  }

  private EXAMPLE_OUTPUT = {
    prop1: null,
    prop2: null,
    prop3: null,
    prop4: null
  }

  constructor(private jsplumbService: JsplumbService) { }

  ngAfterViewInit(): void {
    this.jsplumbService.createInstance(this._container.nativeElement, this.EXAMPLE_INPUT, this.EXAMPLE_OUTPUT);
    this.jsplumbService.prepareNodes(this._inputNode.nativeElement, this._outputNode.nativeElement);
    this.jsplumbService.ready(this.jspReady);
  }

  jspReady() {
    console.log("jsPlumb ready")


  }

}
