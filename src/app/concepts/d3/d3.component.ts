import { Component } from '@angular/core';
import { HierarchyNode, HierarchyPointNode } from 'd3-hierarchy';
import { DataNode, Mappable, MappableDisplay } from 'src/app/d3/d3.types';
import { MappingService } from 'src/app/mapping/mapping.service';
import { MappableToMappingFn } from 'src/app/mapping/mapping.types';


@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.scss']
})
export class D3Component {

  public displayMappings: MappableDisplay[] = [];

  public EXAMPLE_INPUT: { [index:string]: any } = {
    name: "example",
    value: "input",
    id: 1,
    active: true,
    obj: {
      name: "recursive",
      value: "input 2"
    },
    obj2: {
      flag: true,
      reason: ""
    },
    obj3: {
      eekum: "bokum"
    }
  }

  public EXAMPLE_OUTPUT = {
    prop1: null,
    prop2: null,
    prop3: null,
    prop4: null
  }

  constructor(private mappingService: MappingService) { }

  updateMappings(mappings: Mappable[]) {
    this.displayMappings = mappings.map(mappable => ({
      source: { ...mappable.source.data, path: this.mappingService.getPath(mappable.source) },
      target: { ...mappable.target.data, path: this.mappingService.getPath(mappable.target) },
      condition: "TODO",
      transformation: "TODO"
    }));
  }

}
