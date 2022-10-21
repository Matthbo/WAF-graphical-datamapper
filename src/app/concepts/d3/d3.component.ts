import { Component } from '@angular/core';
import { Mapping, SerializableMapping } from 'src/app/jsplumb/jsplumb.types';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.scss']
})
export class D3Component {

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

  updateMappings(mappings: SerializableMapping[]) {
    this.displayMappings = mappings;
  }

}
