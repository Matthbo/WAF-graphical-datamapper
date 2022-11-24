import { HierarchyNode, HierarchyPointNode } from './d3-imports';

export type AnyObject = { [index: string]: any };


export type HierarchyNodeExtra<T> = HierarchyNode<T> & {
    _id?: number | string;
    _children?: HierarchyNodeExtra<T>[];
}

export type HierarchyPointNodeExtra<T> = HierarchyPointNode<T> & {
    _id?: number | string;
    _children?: HierarchyPointNodeExtra<T>[];
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

export type SerializableNodeMapInfo = {
    parentPath: string;
    key: string;
    type: string;
}

export type SerializableMapping = {
    sourceNode: SerializableNodeMapInfo;
    targetNode: SerializableNodeMapInfo;
}
