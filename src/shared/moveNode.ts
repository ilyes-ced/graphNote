import { ChildNode, NodeType } from "../types";
import { store, setStore } from "../components/store";

export default function moveNode(
  movedNodeId: string,
  distNodeId: string,
  nested: true | false = false,
  movedToCanvas: true | false = false,
  canvasCoords?: { x: number; y: number }
) {
  if (nested) {
    let parentNode = store.nodes.find((node) =>
      node.children?.some(
        (childNode: ChildNode) => childNode.id === movedNodeId
      )
    );
    const movedNode = parentNode.children?.find(
      (childNode: ChildNode) => childNode.id === movedNodeId
    );

    console.log(movedNode);
    console.log(
      "nested moved: ",
      movedNode.id,
      " from column: ",
      parentNode?.id,
      " to: ",
      distNodeId
    );

    if (!parentNode || !movedNode) {
      console.warn("Parent of the Node to move not found:", movedNodeId);
      return;
    }

    // remove node from parent
    setStore("nodes", (nodes) =>
      nodes.map((node) => {
        if (node.id === parentNode?.id) {
          return {
            ...node,
            children: node.children?.filter(
              (child) => child.id !== movedNodeId
            ),
          };
        }
        return node;
      })
    );

    // moving node to canvas or new parent
    if (movedToCanvas) {
      console.log(movedNodeId);
      let dims = document.querySelector(`#${movedNodeId}`);
      console.log("nested moved to canvas: ", dims);
      setStore("nodes", (nodes) => [
        ...nodes,
        {
          ...movedNode,
          // removing x and y
          x: canvasCoords?.x, //! fix later to be close to mouse position or its current position
          y: canvasCoords?.y, //! fix later to be close to mouse position or its current position
        },
      ]);
    } else {
      // sent to another parent
      setStore("nodes", (nodes) =>
        nodes.map((node) => {
          if (node.id === distNodeId && node.type === NodeType.Column) {
            const existingChildren = node.children ?? [];
            return {
              ...node,
              children: [
                ...existingChildren,
                {
                  ...movedNode,
                  index: existingChildren.length,
                },
              ],
            };
          }
          return node;
        })
      );
    }
  } else {
    let distNode = store.nodes.find((node) => node.id === distNodeId);
    let movedNode = store.nodes.find((node) => node.id === movedNodeId);
    if (!movedNode) {
      console.warn("Node to move not found:", movedNodeId);
      return;
    }
    if (!distNode) {
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
    setStore("nodes", (nodes) =>
      nodes.filter((node) => node.id !== movedNodeId)
    );
    setStore("nodes", (nodes) =>
      nodes.map((node) => {
        if (node.id === distNodeId && node.type === NodeType.Column) {
          const existingChildren = node.children ?? [];
          return {
            ...node,
            children: [
              ...existingChildren,
              {
                ...movedNode,
                // removing x and y
                x: undefined,
                y: undefined,
                index: existingChildren.length,
              },
            ],
          };
        }
        return node;
      })
    );
  }
}
