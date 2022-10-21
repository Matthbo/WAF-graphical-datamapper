export type AnyObject = { [index: string]: any };

export type Node = {
    key: string;
    // type: string;
    // path
    // element
} & (
    {
        type: "object";
        children: Node[];
    } | 
    {
        type: string;
        value: any;
    }
)
/*     & (ObjectNodePartial | ValueNodePartial);

export type ObjectNodePartial = {
    type: "object";
    children: Node[];
}

export type ValueNodePartial = {
    type: string;
    value: any;
} */

export type SerializableNodeMapInfo = {
    parentPath: string;
    key: string;
    type: string;
}

export type SerializableMapping = {
    sourceNode: SerializableNodeMapInfo;
    targetNode: SerializableNodeMapInfo;
}
