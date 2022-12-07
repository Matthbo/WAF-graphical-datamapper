// @deprecated
export type SerializableNodeMapInfo = {
    parentPath: string;
    key: string;
    type: string;
}

// @deprecated
export type SerializableMapping = {
    sourceNode: SerializableNodeMapInfo;
    targetNode: SerializableNodeMapInfo;
}

export type MappingTarget = {
    element: string; // node key
    type: string;
    repeating: boolean;
    required: boolean;
}

export type MappingSource = {
    element: string; // node key
    path: string;
    condition?: null; // TODO condition type? predefined condition templates?
    transformation?: null; // TODO transformation type? predefined transformation templates?
}

export type Mapping = {
    target: MappingTarget;
    source: MappingSource;
    children?: Mapping[];
}
