import { Component } from '@angular/core';
import { HierarchyNode, HierarchyPointNode } from 'd3-hierarchy';
import { DataNode, Mappable } from 'src/app/d3/d3.types';
import { MappableToMappingFn } from 'src/app/mapping/mapping.types';


@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.scss']
})
export class D3Component {

  public displayMappings: Mappable[] = [];

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

  private mappableToMapping: MappableToMappingFn = (mappables: Mappable) => {
    function getPath(node: HierarchyNode<DataNode>): string {
      if (node.parent == null || node.parent.depth == 0) {
        return node.height == 0 ? "/" : "";
      }

      return `${getPath(node.parent)}/${node.parent.data.key}`;
    }

    return {
      target: {
        element: mappables.target.data.key,
        type: mappables.target.data.type,
        repeating: false, // TODO
        required: false // TODO
      },
      source: {
        element: mappables.source.data.key,
        path: getPath(mappables.source),
        condition: null,
        transformation: null
      },
      
    }
  }

  updateMappings(mappings: Mappable[]) {
    this.displayMappings = mappings;
  }

}
