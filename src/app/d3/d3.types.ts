export type AnyObject = { [index: string]: any };

export type DataNode = {
    key: string;
    id: string;
    // type: string;
    // path
    // element
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
