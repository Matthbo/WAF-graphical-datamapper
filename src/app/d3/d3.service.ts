import { EventEmitter, Injectable } from '@angular/core';
import { faPlus, faMinus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import * as d3 from './d3-imports';
import { BaseType, D3DragEvent, HierarchyPointNode } from './d3-imports';
import { DataNode, HierarchyNodeExtra, HierarchyPointNodeExtra, Mappable } from './d3.types';

@Injectable({
  providedIn: 'root'
})
export class D3Service {

  private _mappings: Mappable[] = [];
  // private _connections: 
  public updateMappingsEvent = new EventEmitter<Mappable[]>();

  iconPlus = faPlus;
  iconMinus = faMinus;

  constructor() { }

  test(icon: IconDefinition) {
    const name = icon.iconName;
    const path = icon.icon[4];
    console.log(name, path)
  }

  getSelection<GElement extends BaseType, OldDatum>(element: GElement | string) {
    // check to make typescript happy
    if (typeof element === "string") {
      return d3.select<GElement, OldDatum>(element) as d3.Selection<GElement, OldDatum, Element, any>;
    }
    return d3.select<GElement, OldDatum>(element) as unknown as d3.Selection<GElement, OldDatum, Element, any>;
  }

  private getChildSelection<PElem extends SVGElement, /* CElem extends SVGElement,  */OldDatum>(container: PElem | string, childSelector: string) {
    if (typeof container === "string") {
      return d3.select<SVGGElement, OldDatum>(`${container} ${childSelector}`) as d3.Selection<SVGGElement, OldDatum, Element, any>;
    }
    return (d3.select<PElem, OldDatum>(container) as unknown as d3.Selection<PElem, OldDatum, Element, any>)
      .select<SVGGElement>(childSelector);
  }

  convertData(rootName: string, data: any, id?: string): DataNode {
    const rootId = id || rootName;
    if (data !== null && typeof data === "object") {
      return {
        key: rootName,
        type: "object",
        id: rootId,
        children: Object.entries(data).map(([key, value]) => this.convertData(key, value, rootId))
      }
    }
    return {
      key: rootName,
      value: data,
      type: data === null ? "null" : typeof data,
      id: rootId
    }
  }

  // https://observablehq.com/@d3/collapsible-tree
  newGenerateCluster(data: DataNode, clusterWidth: number, clusterHeight: number) {
    const animDuration = 300;
    const root = d3.hierarchy(data);
    const clusterLayout = d3.cluster<DataNode>()
      .size([clusterHeight, clusterWidth]);
    const clusterId = Date.now().toString(16).slice(-6);

    root.descendants().forEach((d: HierarchyNodeExtra<DataNode>, i) => {
      d._id = i;
      d._children = d.children;
      if (d.depth > 0) d.children = undefined;
    })

    // node = clicked node
    const update = (node: HierarchyNodeExtra<DataNode> | HierarchyPointNodeExtra<DataNode>) => {

      if (node.hasOwnProperty("x")) {
        const nodePoint = node as HierarchyPointNodeExtra<DataNode>;
        nodePoint.x0 = nodePoint.x;
        nodePoint.y0 = nodePoint.y;
      }

      const rootNode = clusterLayout(root);

      const nodes = rootNode.descendants();
      const links = rootNode.links();

      return (containerElem: SVGGElement | string, offsetWidth: number = 0, offsetHeight: number = 0, invertAxis: boolean = false) => {
        const link = d3.link(d3.curveBumpX);
        const svgElem = typeof containerElem === 'string' ?
          d3.select<SVGSVGElement, unknown>(document.querySelector<SVGGElement>(containerElem)!.parentElement as Element as SVGSVGElement) :
          d3.select<SVGSVGElement, unknown>(containerElem.parentElement as Element as SVGSVGElement);

        this.getSelection(containerElem)
          .attr('offsetWidth', offsetWidth)
          .attr('offsetHeight', offsetHeight);

        const nodePointY0 = ((node as HierarchyPointNodeExtra<DataNode>).y0 || 0) + offsetWidth,
          nodePointY = ((node as HierarchyPointNodeExtra<DataNode>).y || 0) + offsetWidth,
          nodeElemsPosX = (!invertAxis ? 0 : clusterWidth) - nodePointY0,
          nodePointX0 = ((node as HierarchyPointNodeExtra<DataNode>).x0 || 0) + offsetHeight,
          nodePointX = ((node as HierarchyPointNodeExtra<DataNode>).x || 0) + offsetHeight,
          nodeElemsPosY = nodePointX0,
          nodeElemsRemovePosX = (!invertAxis ? 0 : clusterWidth) - nodePointY,
          nodeElemsRemovePosY = nodePointX;

        const nodeElems = this.getChildSelection<SVGGElement, unknown>(containerElem, '.nodes')
          .selectAll<SVGGElement, unknown>('g')
          .data(nodes);

        const nodeElemsEnter = nodeElems.enter().append('g')
          .classed('node', true)
          .attr('id', (d: HierarchyPointNodeExtra<DataNode>) => `${clusterId}-${d._id}`)
          .on('click', (event, d: HierarchyPointNodeExtra<DataNode>) => {
            d.children = d.children ? undefined : d._children;
            console.log(`CLICK ${d.data.key}`, d.children);
            update(d)(containerElem, offsetWidth, offsetHeight, invertAxis);
          });

        nodeElemsEnter.append('circle')
          .classed('has-children', (d: HierarchyPointNodeExtra<DataNode>) => d._children ? true : false)
          .attr('cx', (d) => { return nodeElemsPosX })
          .attr('cy', (d) => { return nodeElemsPosY })
          .attr('r', 3)
          .call(d3.drag<SVGCircleElement, HierarchyPointNode<DataNode>>()
            .on("start", this.handleSVGDragStart(clusterWidth, invertAxis, svgElem, offsetWidth, offsetHeight, link))
            .on("drag", this.handleSVGDragging(svgElem, link))
            .on("end", this.handleSVGDragStop(clusterWidth, invertAxis, svgElem, offsetWidth, offsetHeight, link, this.addMapping.bind(this)))
          );

        nodeElemsEnter.append('text')
          .text((d) => `${d.data.key}: ${d.data.type}`)
          .attr('x', (d) => { return nodeElemsPosX })
          .attr('y', (d) => { return nodeElemsPosY });

        const nodeElemsUpdate = nodeElems.merge(nodeElemsEnter).transition().duration(animDuration);
        nodeElemsUpdate.select<SVGCircleElement>('circle')
          .attr('cx', (d) => { return !invertAxis ? d.y + offsetWidth : clusterWidth - d.y + offsetWidth })
          .attr('cy', (d) => { return d.x + offsetHeight; });
        nodeElemsUpdate.select('text')
          .text((d) => `${d.data.key}: ${d.data.type}`)
          .attr('x', (d) => !invertAxis ? d.y + offsetWidth : clusterWidth - d.y + offsetWidth)
          .attr('y', (d) => d.x + offsetHeight)
          .attr('text-anchor', !invertAxis ? 'end' : 'start')
          .attr('transform', (d) => !invertAxis ? `translate(-10, 3.5)` : `translate(10, 3.5)`);

        const nodeElemsRemove = nodeElems.exit().transition().duration(animDuration).remove();
        nodeElemsRemove.select('circle')
          .attr('cx', (d) => { return nodeElemsRemovePosX })
          .attr('cy', (d) => { return nodeElemsRemovePosY });
        nodeElemsRemove.select('text')
          .attr('x', (d) => { return nodeElemsRemovePosX })
          .attr('y', (d) => { return nodeElemsRemovePosY });

        const nodePaths = this.getChildSelection<SVGGElement, unknown>(containerElem, '.links')
          .selectAll<SVGPathElement, unknown>('path.link')
          .data(links);

        const nodePathsEnter = nodePaths.enter().append('path')
          .classed('link', true)
          .attr('d', (d) => {
            const oPos: [number, number] = [nodePointY0, nodePointX0];
            const invertOPos: [number, number] = [nodeElemsPosX, nodeElemsPosY]
            return !invertAxis ? link({ source: oPos, target: oPos }) : link({ source: invertOPos, target: invertOPos });
          });

        nodePaths.merge(nodePathsEnter).transition().duration(animDuration)
          .attr('d', (d) =>
            !invertAxis ? link({
              source: [d.source.y + offsetWidth, d.source.x + offsetHeight],
              target: [d.target.y + offsetWidth, d.target.x + offsetHeight]
            }) : link({
              source: [clusterWidth - d.source.y + offsetWidth, d.source.x + offsetHeight],
              target: [clusterWidth - d.target.y + offsetWidth, d.target.x + offsetHeight]
            })
          );

        const nodePathsRemove = nodePaths.exit().transition().duration(animDuration).remove();
        nodePathsRemove.attr('d', (d) => {
          const oPos: [number, number] = [nodePointY, nodePointX];
          const invertOPos: [number, number] = [nodeElemsRemovePosX, nodeElemsRemovePosY]
          return !invertAxis ? link({ source: oPos, target: oPos }) : link({ source: invertOPos, target: invertOPos });
        });

        if(this._mappings.length > 0){

        }
      }
    }

    return update(root);
  }

  private handleSVGDragStart(width: number, invertAxis: boolean, svgSelection: d3.Selection<SVGSVGElement, unknown, null, any>, offsetWidth: number, offsetHeight: number, link: d3.Link<any, d3.DefaultLinkObject, [number, number]>) {
    return function <T extends Element>(this: T, event: D3DragEvent<T, unknown, HierarchyPointNode<DataNode>>, d: HierarchyPointNode<DataNode>) {
      const sourceX = invertAxis ? width - event.y + offsetWidth : event.y + offsetWidth;
      const sourceY = event.x + offsetHeight;

      const mouseEvent = event.sourceEvent as MouseEvent;
      const svg = svgSelection.node()!;
      const pt = svg.createSVGPoint();
      pt.x = mouseEvent.clientX; pt.y = mouseEvent.clientY;

      const svgCoords = pt.matrixTransform(svg.getScreenCTM()!.inverse());
      const offsetX = svgCoords.x - sourceX;
      const offsetY = svgCoords.y - sourceY;

      svgSelection
        .append('circle').lower()
        .classed('dragging', true)
        .attr('cx', sourceX + offsetX)
        .attr('cy', sourceY + offsetY)
        .attr('r', 4);

      svgSelection
        .append('path').lower()
        .classed('dragging', true)
        .attr('source', `${sourceX},${sourceY}`)
        .attr('d', link({
          source: [sourceX, sourceY],
          target: [sourceX + offsetX, sourceY + offsetY]
        }));
    }
  }

  private handleSVGDragging(svgSelection: d3.Selection<SVGSVGElement, unknown, null, any>, link: d3.Link<any, d3.DefaultLinkObject, [number, number]>) {
    return function <T extends Element>(this: T, event: D3DragEvent<T, unknown, HierarchyPointNode<DataNode>>, d: HierarchyPointNode<DataNode>) {
      const draggingElem = svgSelection.select<SVGCircleElement>('circle.dragging');
      const draggingPath = svgSelection.select<SVGPathElement>('path.dragging');
      const currX = +draggingElem.attr('cx');
      const currY = +draggingElem.attr('cy');
      const sourcePos = draggingPath.attr('source').split(',').map(Number) as [number, number];

      draggingElem
        .attr('cx', currX + event.dx)
        .attr('cy', currY + event.dy);

      draggingPath
        .attr('d', link({
          source: sourcePos,
          target: [currX + event.dx, currY + event.dy]
        }));
    }
  }

  // TODO check if mappable[] is updated correctly so it can be used to update connection positions
  private handleSVGDragStop(width: number, invertAxis: boolean, svgSelection: d3.Selection<SVGSVGElement, unknown, null, any>, offsetWidth: number, offsetHeight: number, link: d3.Link<any, d3.DefaultLinkObject, [number, number]>, addMappingFn: (s: d3.HierarchyPointNode<DataNode>, t: d3.HierarchyPointNode<DataNode>) => void) {
    return function <T extends Element>(this: T, event: D3DragEvent<T, unknown, HierarchyPointNode<DataNode>>, d: HierarchyPointNode<DataNode>) {
      const mouseEvent = event.sourceEvent as MouseEvent;
      const targetElem = d3.select<SVGPathElement | Element, HierarchyPointNode<DataNode>>(mouseEvent.target as Element);
      const targetNode = targetElem.datum();
      svgSelection.select('circle.dragging').remove();
      svgSelection.select('path.dragging').remove();

      console.log(`this in dragstop`, this);

      if (targetNode != null && d !== targetNode && d.data.id !== targetNode.data.id) {
        const [targetOffsetW, targetOffsetH] = ((selection: d3.Selection<Element, HierarchyPointNode<DataNode>, null, undefined>) => {
          const offsetElem = d3.select(selection.node()!.parentElement!.parentElement!.parentElement);
          return [offsetElem.attr("offsetWidth"), offsetElem.attr("offsetHeight")];
        })(targetElem);

        const sourceX = invertAxis ? width - d.y + offsetWidth : d.y + offsetWidth;
        const sourceY = d.x + offsetHeight;
        const targetX = !invertAxis ? width - targetNode.y + (+targetOffsetW) : targetNode.y + (+targetOffsetW);
        const targetY = targetNode.x + (+targetOffsetH);

        svgSelection.select('g.connections')
          .append('path')
          .attr('d', link({
            source: [sourceX, sourceY],
            target: [targetX, targetY]
          }));

        const sourceIsInput = d.data.id === "input";

        // TODO make connections array with this, targetElement and more positional info?
        sourceIsInput ? addMappingFn(d, targetNode) : addMappingFn(targetNode, d);
      }
    }
  }

  private addMapping(source: d3.HierarchyPointNode<DataNode>, target: d3.HierarchyPointNode<DataNode>) {
    this._mappings.push({
      source,
      target,
      condition: null,
      transformation: null
    });
    this.updateMappingsEvent.emit(this._mappings);
  }

  reset() {
    this._mappings = [];
  }

}
