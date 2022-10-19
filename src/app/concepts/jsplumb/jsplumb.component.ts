import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Mapping, SerializableMapping} from "../../jsplumb/jsplumb.types";


@Component({
  selector: 'app-jsplumb',
  templateUrl: './jsplumb.component.html',
  styleUrls: ['./jsplumb.component.scss']
})
export class JsplumbComponent {

  public displayMappings: SerializableMapping[] = [];

  public EXAMPLE_INPUT: { [index:string]: any } = {
    name: "example",
    value: "input",
    id: 1,
    active: true,
    obj: {
      name: "recursive",
      value: "input 2"
    }
  }

  public EXAMPLE_OUTPUT = {
    prop1: null,
    prop2: null,
    prop3: null,
    prop4: null
  }

  updateMappings(mappings: Mapping[]) {
    this.displayMappings = mappings.map(m => m.toSerializable());
    console.log("updated mappings", this.displayMappings);
  }

}
