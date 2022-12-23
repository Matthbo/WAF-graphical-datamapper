import { HierarchyNode, HierarchyPointNode, Selection } from './d3-imports';

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

export type connection = {
    source: Selection<HierarchyNode<DataNode>>;
    target: HierarchyNode<DataNode>;
}

export type Mappable = {
    source: HierarchyNode<DataNode>
    target: HierarchyNode<DataNode>
    condition?: null; // TODO condition type? predefined condition templates?
    transformation?: null; // TODO transformation type? predefined transformation templates?
}

export type MappableDisplay = {
    source: DataNode & { path: string };
    target: DataNode & { path: string };
    condition: string;
    transformation: string;
}
