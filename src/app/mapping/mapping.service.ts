import { Injectable } from '@angular/core';
import { HierarchyNode } from '../d3/d3-imports';
import { DataNode, Mappable } from '../d3/d3.types';
import { MappableToMappingFn } from './mapping.types';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor() { }

  getPath(node: HierarchyNode<DataNode>): string {
    if (node.parent == null || node.parent.depth == 0) {
      return "/";
    }

    const prevPath = this.getPath(node.parent);

    if(prevPath == "/") return prevPath + node.parent.data.key;
    return `${prevPath}/${node.parent.data.key}`;
  }

  mappableToMapping: MappableToMappingFn = (mappables: Mappable) => {
    return {
      target: {
        element: mappables.target.data.key,
        type: mappables.target.data.type,
        repeating: false, // TODO
        required: false // TODO
      },
      source: {
        element: mappables.source.data.key,
        path: this.getPath(mappables.source),
        condition: null,
        transformation: null
      },

    }
  }

  // TODO mappings crud / helpers
  // TODO mapping file generator

}
