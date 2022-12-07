import { HierarchyNode, HierarchyPointNode } from './d3-imports';

export type AnyObject = { [index: string]: any };

export type HierarchyNodeExtra<T> = HierarchyNode<T> & {
    _id?: number | string;
    _children?: HierarchyNodeExtra<T>[];
}

export type HierarchyPointNodeExtra<T> = HierarchyPointNode<T> & {
    _id?: number | string;
    _children?: HierarchyPointNodeExtra<T>[];
    x0?: number;
    y0?: number;
};

export type DataNode = {
    key: string;
    id: string;
} & (
    {
        type: "object";
        children: DataNode[];
    } |
    {
        type: string;
        value: any;
    }
)
