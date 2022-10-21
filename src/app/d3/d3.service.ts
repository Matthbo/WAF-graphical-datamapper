import { EventEmitter, Injectable } from '@angular/core';
import * as d3 from './d3-imports';
import { SerializableMapping, Node } from './d3.types';

@Injectable({
  providedIn: 'root'
})
export class D3Service {

  private _mappings: SerializableMapping[] = [];

  public updateMappingsEvent = new EventEmitter<SerializableMapping[]>();

  constructor() { }

  convertData(name: string, data: any): Node {
    if (data !== null && typeof data === "object") {
      return {
        key: name,
        type: "object",
        children: Object.entries(data).map(([key, value]) => this.convertData(key, value))
      }
    }

    return {
      key: name,
      value: data,
      type: data === null ? "null" : typeof data
    }
  }

  // TODO split function into smaller parts where DOM is prepared by directive
  createSVGCluster(data: Node, containerSelector: string, nodesSelector: string, linksSelector: string, overlaySelector: string, offsetWidth: number = 0, offsetHeight: number = 0, invertAxis: boolean = false) {
    const rootNode = d3.hierarchy(data);
    const width = 400, height = 600;
    const clusterLayout = d3.cluster<Node>()
      .size([height, width]);
    const cluster = clusterLayout(rootNode);

    d3.select(document.querySelector<SVGGElement>(`${containerSelector} ${nodesSelector}`)!.parentElement)
      .attr('offsetWidth', offsetWidth)
      .attr('offsetHeight', offsetHeight);

    d3.select<SVGElement, unknown>(`${containerSelector} ${nodesSelector}`)
      .selectAll<SVGCircleElement, unknown>('circle.node')
      .data(cluster.descendants())
      .join<SVGCircleElement>('circle')
      .classed('node', true)
      .attr('cx', (d) => { return !invertAxis ? d.y + offsetWidth : width - d.y + offsetWidth })
      .attr('cy', (d) => { return d.x + offsetHeight; })
      .attr('r', 4)
      .call(d3.drag<SVGCircleElement, HierarchyPointNode<Node>>()
        .on("start", handleSVGDragStart(width, invertAxis, containerSelector, offsetWidth, offsetHeight))
        .on("end", handleSVGDragStop(width, invertAxis, containerSelector, offsetWidth, offsetHeight))
        .on("drag", handleSVGDragging())
      )

    const link = d3.link(d3.curveBumpX);
    d3.select(`${containerSelector} ${linksSelector}`)
      .selectAll('path.link')
      .data(cluster.links())
      .join('path')
      .classed('link', true)
      .attr('d', (d) =>
        !invertAxis ? link({
          source: [d.source.y + offsetWidth, d.source.x + offsetHeight],
          target: [d.target.y + offsetWidth, d.target.x + offsetHeight]
        }) : link({
          source: [width - d.source.y + offsetWidth, d.source.x + offsetHeight],
          target: [width - d.target.y + offsetWidth, d.target.x + offsetHeight]
        })
      );

    d3.select(`${containerSelector} ${overlaySelector}`)
      .selectAll('text')
      .data(cluster.descendants())
      .join('text')
      .attr('x', (d) => !invertAxis ? d.y + offsetWidth : width - d.y + offsetWidth)
      .attr('y', (d) => d.x + offsetHeight)
      .text((d) => `${d.data.key}: ${d.data.type}`)
      .attr('text-anchor', !invertAxis ? 'end' : 'start')
      .attr('transform', (d) => !invertAxis ? `translate(-10, 4)` : `translate(10, 4)`);
  }


}
