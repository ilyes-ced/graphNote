import { ChildNode, NodeType } from "../types";
import { store, setStore } from "./store";
import {
  addNode,
  findNodeById,
  findParentIdByNodeId,
  removeNodeById,
} from "./update";

export default function moveNode(
  movedNodeId: string,
  distNodeId: string,
  nested: true | false = false,
  movedToCanvas: true | false = false,
  canvasCoords?: { x: number; y: number }
) {
  if (nested) {
    let oldParentNodeId = findParentIdByNodeId(movedNodeId);
    if (!oldParentNodeId) {
      console.warn("Parent of the Node to move not found:", movedNodeId);
      return;
    }

    let movedNode = store.nodes[oldParentNodeId].find(
      (n) => n.id === movedNodeId
    );
    if (!movedNode) {
      console.warn("the Node to move not found:", movedNodeId);
      return;
    }

    // remove node from parent
    removeNodeById(movedNodeId, oldParentNodeId);

    // moving node to canvas or new parent
    if (movedToCanvas) {
      console.log(movedNodeId);
      console.log(
        "nested moved to canvas: ",
        movedNodeId,
        distNodeId,
        nested,
        movedToCanvas,
        canvasCoords
      );
      // put it in activeboard
      addNode({
        ...movedNode,
        // removing x and y
        x: canvasCoords?.x || 0,
        y: canvasCoords?.y || 0,
        index: store.nodes[distNodeId]?.length ?? 0,
      });
    } else {
      // sent to another parent
      addNode(
        {
          ...movedNode,
          // removing x and y
          x: canvasCoords?.x || 0,
          y: canvasCoords?.y || 0,
          index: store.nodes[distNodeId]?.length ?? 0,
        },
        distNodeId
      );
    }
  } else {
    // tODO: no need to bring the entire node fix later
    let distNode = findNodeById(distNodeId); //store.nodes.find((node) => node.id === distNodeId);
    let movedNode = findNodeById(movedNodeId); //store.nodes.find((node) => node.id === movedNodeId);
    if (!movedNode) {
      console.warn("Node to move not found:", movedNodeId);
      return;
    }
    if (!distNode) {
      console.warn("parent dist node to move to not found:", distNodeId);
      return;
    }
    if (movedNode.type === distNode.type) {
      console.warn(
        "Cannot nest nodes of the same type, nodemoved:",
        movedNode.type,
        "parent:",
        distNode.type
      );
      return;
    }

    console.log("moved to inside a column from the canvas");
    removeNodeById(movedNodeId);

    console.log("starting to add the node");
    addNode(
      {
        ...movedNode,
        // removing x and y
        x: canvasCoords?.x || 0,
        y: canvasCoords?.y || 0,
        index: store.nodes[distNode.id]?.length ?? 0,
      },
      distNode.id
    );

    ////////////////////////////////////////////////
    //
    //    setStore("nodes", (nodes) =>
    //      nodes.map((node) => {
    //        if (node.id === distNodeId && node.type === NodeType.Column) {
    //          const existingChildren = node.children ?? [];
    //          return {
    //            ...node,
    //            children: [
    //              ...existingChildren,
    //              {
    //                ...movedNode,
    //                // removing x and y
    //                x: undefined,
    //                y: undefined,
    //                index: existingChildren.length,
    //              },
    //            ],
    //          };
    //        }
    //        return node;
    //      })
    //    );
  }
}
