import {
  Board,
  Image,
  Color,
  Column,
  NodeType,
  NodeUnion,
  Note,
  Table,
  Task,
  Activity,
  Todo,
  Url,
  ColorType,
} from "../types";
import { setStore, store } from "./store";
import { saveChanges } from "./utils";
import { actionsMiddleware } from "./actions";



const updateTaskOG = (
  nodeId: string,
  value: string | boolean,
  taskIndex: number
) => {
  for (const [parentId, nodeList] of Object.entries(store.nodes)) {
    const nodeIndex = nodeList.findIndex((node) => node.id === nodeId);
    let updatedField: string;

    if (typeof value === "boolean") {
      updatedField = "check";
    } else if (typeof value === "string") {
      updatedField = "text";
    } else {
      return;
    }

    if (nodeIndex !== -1) {
      // Make sure it's a Todo with a tasks array
      const node = store.nodes[parentId][nodeIndex];
      if (
        "tasks" in node &&
        Array.isArray(node.tasks) &&
        node.tasks[taskIndex]
      ) {
        console.log(
          "Updating:",
          parentId,
          nodeIndex,
          "tasks",
          taskIndex,
          updatedField,
          value
        );
        setStore(
          "nodes",
          parentId,
          nodeIndex,
          "tasks",
          taskIndex,
          updatedField,
          value
        );
      } else {
        console.warn("Node found but tasks array or index is invalid");
      }
      break;
    }
  }

  saveChanges();
};


const updateTask = (nodeId: string, value: string | boolean, taskIndex: number) => {
  for (const [parentId, nodes] of Object.entries(store.nodes)) {
    const nodeIndex = nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) continue;

    const node = nodes[nodeIndex];
    if (!("tasks" in node) || !Array.isArray(node.tasks) || !node.tasks[taskIndex]) continue;

    const oldValue = node.tasks[taskIndex][typeof value === "boolean" ? "check" : "text"];
    const key = typeof value === "boolean" ? "check" : "text";

    setStore("nodes", parentId, nodeIndex, "tasks", taskIndex, key, value);
    saveChanges();

    return {
      undo() {
        setStore("nodes", parentId, nodeIndex, "tasks", taskIndex, key, oldValue);
        saveChanges();
      },
      redo() {
        setStore("nodes", parentId, nodeIndex, "tasks", taskIndex, key, value);
        saveChanges();
      },
    };
  }
};

//? update Note text content
const updateNote = (nodeId: string, newValue: string) => {
  for (const [parentId, nodeList] of Object.entries(store.nodes)) {
    const index = nodeList.findIndex((n) => n.id === nodeId);
    if (index !== -1) {
      const oldValue = store.nodes[parentId][index].text;
      setStore("nodes", parentId, index, "text", newValue);
      saveChanges();

      return {
        undo() {
          setStore("nodes", parentId, index, "text", oldValue);
          saveChanges();
        },
        redo() {
          setStore("nodes", parentId, index, "text", newValue);
          saveChanges();
        },
      };
    }
  }

};

const getActiveBoardId = (): string => {
  return store.activeBoards[store.activeBoards.length - 1].id;
};

//? on dragstart, increase the z index of dragged node to make appear on top always
//TODO: change to indlude only the current active board
//TODO: change to include child elemnts as well
const updateZIndex = (nodeId: string) => {
  const activeBoardId = store.activeBoards.at(-1)?.id;
  if (!activeBoardId) return;

  const boardNodes = store.nodes[activeBoardId] ?? [];
  const index = boardNodes.findIndex(n => n.id === nodeId);
  if (index === -1) return;

  const oldZ = boardNodes[index].zIndex ?? 0;
  const newZ = Math.max(...boardNodes.map(n => n.zIndex ?? 0)) + 1;

  setStore("nodes", activeBoardId, index, "zIndex", newZ);

  return {
    undo() {
      setStore("nodes", activeBoardId, index, "zIndex", oldZ);
    },
    redo() {
      setStore("nodes", activeBoardId, index, "zIndex", newZ);
    },
  };
};

//? update node position


const updateMovingPosition = (nodeId: string, x: number, y: number) => {
  const activeBoardId = getActiveBoardId();
  const boardNodes = store.nodes[activeBoardId] ?? [];
  const index = boardNodes.findIndex((n) => n.id === nodeId);
  if (index !== -1) {
    if (x > 0) setStore("nodes", activeBoardId, index, "x", x);
    if (y > 0) setStore("nodes", activeBoardId, index, "y", y);

  }
};

const updatePosition = (nodeId: string, x: number, y: number) => {
  const activeBoardId = getActiveBoardId();
  const boardNodes = store.nodes[activeBoardId] ?? [];

  const index = boardNodes.findIndex((n) => n.id === nodeId);
  if (index !== -1) {
    const oldX = boardNodes[index].x;
    const oldY = boardNodes[index].y;


    if (x > 0) setStore("nodes", activeBoardId, index, "x", x);
    if (y > 0) setStore("nodes", activeBoardId, index, "y", y);
    saveChanges();

    return {
      undo() {
        setStore("nodes", activeBoardId, index, "x", oldX);
        setStore("nodes", activeBoardId, index, "y", oldY);
        saveChanges();
      },
      redo() {
        setStore("nodes", activeBoardId, index, "x", x);
        setStore("nodes", activeBoardId, index, "y", y);
        saveChanges();
      },
    };
  }

  saveChanges();
};

//? update node position for arrow keys
const incrementSelectedNodesPositions = (dx: number, dy: number) => {
  const activeBoardId = store.activeBoards.at(-1)?.id;
  if (!activeBoardId) return;

  const affected = Array.from(store.selectedNodes)
    .map(id => {
      const index = (store.nodes[activeBoardId] ?? []).findIndex(n => n.id === id);
      if (index === -1) return null;
      const node = store.nodes[activeBoardId][index];
      return { index, oldX: node.x, oldY: node.y, newX: node.x + dx, newY: node.y + dy };
    })
    .filter(Boolean) as { index: number; oldX: number; oldY: number; newX: number; newY: number }[];

  if (!affected.length) return;

  affected.forEach(n => {
    setStore("nodes", activeBoardId, n.index, "x", n.newX);
    setStore("nodes", activeBoardId, n.index, "y", n.newY);
  });
  saveChanges();

  return {
    undo() {
      affected.forEach(n => {
        setStore("nodes", activeBoardId, n.index, "x", n.oldX);
        setStore("nodes", activeBoardId, n.index, "y", n.oldY);
      });
      saveChanges();
    },
    redo() {
      affected.forEach(n => {
        setStore("nodes", activeBoardId, n.index, "x", n.newX);
        setStore("nodes", activeBoardId, n.index, "y", n.newY);
      });
      saveChanges();
    },
  };
};

//? update node wdith
const updateNodeWidth = (nodeId: string, width: number) => {
  const activeBoardId = getActiveBoardId();
  const boardNodes = store.nodes[activeBoardId] ?? [];

  const index = boardNodes.findIndex((n) => n.id === nodeId);
  if (index !== -1) {
    setStore("nodes", activeBoardId, index, "width", width);
  }

  saveChanges();
};

//? update position of a nested node
const updateChildPosition = (nodeId: string, x: number, y: number) => {
  // find active board id
  // find a column node that has child nodeId
  // we find a column node  by type matching we search all the records with that id if they have our nodeId

  const activeBoardId = getActiveBoardId();

  outerLoop: for (const parentNode of store.nodes[activeBoardId] || []) {
    if (parentNode.type === NodeType.Column) {
      const childNodes = store.nodes[parentNode.id] || [];
      for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.id === nodeId) {
          console.log(node);
          setStore("nodes", parentNode.id, i, "x", x);
          setStore("nodes", parentNode.id, i, "y", y);
          break outerLoop;
        }
      }
    }
  }

  saveChanges();
};
/* //! very funcky
const updateChildPosition = (nodeId: string, x: number, y: number) => {
  const activeBoardId = store.activeBoards.at(-1)?.id;
  if (!activeBoardId) return;

  outerLoop: for (const parentNode of store.nodes[activeBoardId] ?? []) {
    if (parentNode.type !== NodeType.Column) continue;

    const childNodes = store.nodes[parentNode.id] ?? [];
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      if (node.id === nodeId) {
        const oldX = node.x;
        const oldY = node.y;

        setStore("nodes", parentNode.id, i, "x", x);
        setStore("nodes", parentNode.id, i, "y", y);
        saveChanges();

        return {
          undo() {
            setStore("nodes", parentNode.id, i, "x", oldX);
            setStore("nodes", parentNode.id, i, "y", oldY);
            saveChanges();
          },
          redo() {
            setStore("nodes", parentNode.id, i, "x", x);
            setStore("nodes", parentNode.id, i, "y", y);
            saveChanges();
          },
        };
      }
    }
  }
};
*/

const isColumn = (nodeId: string): boolean => {
  const activeBoardId = getActiveBoardId();
  const nodesInActiveBoard = store.nodes[activeBoardId] ?? [];

  const isColumn = nodesInActiveBoard.some(
    (storeNode) => storeNode.id === nodeId && storeNode.type === NodeType.Column
  );

  return isColumn;
};

const findNodeById = (nodeId: string): NodeUnion | undefined => {
  for (const nodes of Object.values(store.nodes)) {
    const found = nodes.find((n) => n.id === nodeId);
    if (found) return found;
  }
};

const findParentIdByNodeId = (nodeId: string): string | null => {
  for (const [parentId, childNodes] of Object.entries(store.nodes)) {
    if (childNodes.some((node) => node.id === nodeId)) {
      return parentId;
    }
  }
  return null;
};

const removeNodeById = (nodeId: string, parentId?: string) => {
  const activeBoardId = store.activeBoards.at(-1)?.id;
  const targetId = parentId ?? activeBoardId;
  if (!targetId) return;

  const currentNodes = store.nodes[targetId] ?? [];
  const index = currentNodes.findIndex(n => n.id === nodeId);
  if (index === -1) return;

  const removedNode = currentNodes[index];
  const updated = [...currentNodes.slice(0, index), ...currentNodes.slice(index + 1)];
  setStore("nodes", targetId, updated);
  saveChanges();

  return {
    undo() {
      setStore("nodes", targetId, currentNodes);
      saveChanges();
    },
    redo() {
      setStore("nodes", targetId, updated);
      saveChanges();
    },
  };
};


/*
const addNode = (
  newNode: NodeUnion,
  // x: number,
  // y: number,
  //* if is set to tru, node is sent to active board = canvas
  //* if it is set, node is sent to another node
  targetNodeId?: string
) => {
  if (targetNodeId) {
    setStore("nodes", targetNodeId, (nodes = []) => [...nodes, newNode]);
  } else {
    const activeBoardId = getActiveBoardId();
    setStore("nodes", activeBoardId, (nodes = []) => [...nodes, newNode]);
  }

  saveChanges();
};
*/
//! when putting child in coolumn and doing undo, it goes out of parent but not back to canvas
//! also the opposit doesnt work
const addNode = (newNode: NodeUnion, targetNodeId?: string) => {
  const activeBoardId = store.activeBoards.at(-1)?.id;
  const targetId = targetNodeId ?? activeBoardId;
  if (!targetId) return;

  const currentNodes = store.nodes[targetId] ?? [];

  setStore("nodes", targetId, [...currentNodes, newNode]);
  saveChanges();

  return {
    undo() {
      setStore("nodes", targetId, currentNodes);
      saveChanges();
    },
    redo() {
      setStore("nodes", targetId, [...currentNodes, newNode]);
      saveChanges();
    },
  };
};


const generateNewId = (): string => {
  const allNodes = Object.values(store.nodes).flat();
  let maxId = 0;

  for (const node of allNodes) {
    const match = node.id.match(/^node_(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxId) maxId = num;
    }
  }

  return `node_${maxId + 1}`;
};

const generateNewNode = (type: NodeType, x: number, y: number): NodeUnion => {
  const base = {
    id: generateNewId(),
    type,
    width: 300,
    x,
    y,
    index: 0,
  };

  switch (type) {
    case NodeType.Note:
      return {
        ...base,
        text: '{"type":"doc","content":[{"type":"paragraph"}]}',
      } satisfies Note;

    case NodeType.Comment:
      return {
        ...base,
        comment: "",
      };

    case NodeType.Todo:
      return {
        ...base,
        title: "",
        tasks: [{ text: "test", check: false, nestLevel: 0 }],
      } satisfies Todo;

    case NodeType.Table:
      return {
        ...base,
        columns: [],
        rows: [],
        title: "",
        description: "",
      } satisfies Table;

    case NodeType.Url:
      return {
        ...base,
        url: "",
      } satisfies Url;

    case NodeType.Board:
      return {
        ...base,
        name: "New Board",
        icon_path: "",
      } satisfies Board;

    case NodeType.Column:
      return {
        ...base,
        title: "New Column",
      } satisfies Column;

    case NodeType.Document:
      return {
        ...base,
        text: "",
      } satisfies Note;

    case NodeType.Color:
      return {
        ...base,
        colorValue: "#ffffff", //TODO: randomize it
        text: "Color Node",
      } satisfies Color;

    case NodeType.Image:
      return {
        ...base,
        path: "",
        title: "Untitled Image",
        description: "",
      } satisfies Image;

    case NodeType.Activity:
      return {
        ...base,
        // TODO: Fill once you define what Activity contains
        width: undefined,
        progress: {}
      } as Activity;

    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
};

const newNode = (type: NodeType, x: number, y: number) => {
  const activeBoardId = getActiveBoardId();

  //todo: adjust the x and y to scale as well
  console.log("creatign a new node with coords : ", x, y)
  let snappedX: number, snappedY: number;
  if (store.snapGrid) {
    snappedX = Math.round(x / 10) * 10;
    snappedY = Math.round(y / 10) * 10;
  }

  setStore("nodes", activeBoardId, (nodes = []) => [
    ...nodes,
    generateNewNode(type, snappedX ?? x, snappedY ?? y),
  ]);

  saveChanges();
};

const newImageNode = (img: string, x: number, y: number) => {
  const activeBoardId = getActiveBoardId();

  //todo: adjust the x and y to scale as well

  let snappedX: number = x,
    snappedY: number = y;
  if (store.snapGrid) {
    snappedX = Math.round(x / 10) * 10;
    snappedY = Math.round(y / 10) * 10;
  }

  const imageNode = {
    id: generateNewId(),
    type: NodeType.Image,
    width: 300,
    x: snappedX,
    y: snappedY,
    index: 0,
    path: img,
    title: "Untitled Image",
    description: "test",
  };

  setStore("nodes", activeBoardId, (nodes = []) => [...nodes, imageNode]);
  updateZIndex(imageNode.id);

  saveChanges();
};

//? update node colors, fg or bg or strip
const updateNodeColor = (nodeId: string, type: "bg" | "fg" | "strip", color: ColorType) => {
  const activeBoardId = store.activeBoards.at(-1)?.id;
  if (!activeBoardId) return;

  const boardNodes = store.nodes[activeBoardId] ?? [];
  const index = boardNodes.findIndex(n => n.id === nodeId);
  if (index === -1) return;

  let oldValue: any;
  switch (type) {
    case "bg": oldValue = boardNodes[index].color; setStore("nodes", activeBoardId, index, "color", color); break;
    case "fg": oldValue = boardNodes[index].textColor; setStore("nodes", activeBoardId, index, "textColor", color); break;
    case "strip": oldValue = boardNodes[index].top_strip_color; setStore("nodes", activeBoardId, index, "top_strip_color", color); break;
  }
  saveChanges();

  return {
    undo() {
      switch (type) {
        case "bg": setStore("nodes", activeBoardId, index, "color", oldValue); break;
        case "fg": setStore("nodes", activeBoardId, index, "textColor", oldValue); break;
        case "strip": setStore("nodes", activeBoardId, index, "top_strip_color", oldValue); break;
      }
      saveChanges();
    },
    redo() {
      switch (type) {
        case "bg": setStore("nodes", activeBoardId, index, "color", color); break;
        case "fg": setStore("nodes", activeBoardId, index, "textColor", color); break;
        case "strip": setStore("nodes", activeBoardId, index, "top_strip_color", color); break;
      }
      saveChanges();
    },
  };
};

const unsetStripColor = () => {
  store.selectedNodes.forEach((nodeId) => {
    const activeBoardId = getActiveBoardId();
    const boardNodes = store.nodes[activeBoardId] ?? [];

    const index = boardNodes.findIndex((n) => n.id === nodeId);
    if (index !== -1) {
      setStore("nodes", activeBoardId, index, (prev) => ({
        ...prev,
        top_strip_color: undefined,
      }));
    }
  });

  saveChanges();
};

const changeToUrlNode = (nodeId: string, url: string) => {
  for (const [parentId, nodeList] of Object.entries(store.nodes)) {
    const index = nodeList.findIndex((n) => n.id === nodeId);
    if (index !== -1) {
      setStore("nodes", parentId, index, (oldNote) => ({
        ...oldNote,
        type: NodeType.Url,
        url: url,
        text: undefined,
      }));
      break;
    }
  }

  saveChanges();
};

const updateNodeTitle = (nodeId: string, newValue: string) => {
  for (const [parentId, nodeList] of Object.entries(store.nodes)) {
    const index = nodeList.findIndex((n) => n.id === nodeId);
    if (index !== -1) {
      setStore("nodes", parentId, index, "title", newValue);
      break;
    }
  }

  saveChanges();
};

const updateActivityCounter = (
  nodeId: string,
  date: string,
  newValue: number
) => {
  console.log(nodeId, date, newValue);
  for (const [parentId, nodeList] of Object.entries(store.nodes)) {
    const index = nodeList.findIndex((n) => n.id === nodeId);
    if (index !== -1) {
      setStore(
        "nodes",
        parentId,
        index,
        "progress",
        date,
        // make go no less than 0
        (prev) => (prev ?? 0) + newValue
      );
      break;
    }
  }

  saveChanges();
};

const reorderTasks = (nodeId: string, tasks: Task[]) => {
  for (const [parentId, nodes] of Object.entries(store.nodes)) {
    const index = nodes.findIndex(n => n.id === nodeId);
    if (index === -1) continue;

    const oldTasks = nodes[index].tasks ?? [];
    setStore("nodes", parentId, index, "tasks", tasks);
    saveChanges();

    return {
      undo() {
        setStore("nodes", parentId, index, "tasks", oldTasks);
        saveChanges();
      },
      redo() {
        setStore("nodes", parentId, index, "tasks", tasks);
        saveChanges();
      },
    };
  }
};

const newDocumentNode = (
  path: string,
  x: number,
  y: number,
  docType: string
) => {
  const activeBoardId = getActiveBoardId();

  //todo: adjust the x and y to scale as well

  let snappedX: number = x,
    snappedY: number = y;
  if (store.snapGrid) {
    snappedX = Math.round(x / 10) * 10;
    snappedY = Math.round(y / 10) * 10;
  }

  const docNode = {
    id: generateNewId(),
    type: NodeType.Document,
    width: 300,
    x: snappedX,
    y: snappedY,
    index: 0,
    path: path,
    description: "test",
    docType: docType,
  };

  setStore("nodes", activeBoardId, (nodes = []) => [...nodes, docNode]);

  saveChanges();
};

// export {
//   updateNote,
//   updateZIndex,
//   updatePosition,
//   incrementSelectedNodesPositions,
//   updateChildPosition,
//   getActiveBoardId,
//   isColumn,
//   findNodeById,
//   findParentIdByNodeId,
//   removeNodeById,
//   addNode,
//   generateNewId,
//   updateNodeWidth,
//   newNode,
//   updateTask,
//   updateNodeColor,
//   changeToUrlNode,
//   unsetStripColor,
//   updateNodeTitle,
//   newImageNode,
//   updateActivityCounter,
//   reorderTasks,
//   newDocumentNode,
// };
// 

//! very lazy behavior i know
const wrappedUpdateNote = actionsMiddleware(updateNote);
const wrappedUpdateZIndex = actionsMiddleware(updateZIndex);
const wrappedUpdatePosition = actionsMiddleware(updatePosition);
const wrappedIncrementSelectedNodesPositions = actionsMiddleware(incrementSelectedNodesPositions);
const wrappedUpdateChildPosition = actionsMiddleware(updateChildPosition);
const wrappedGetActiveBoardId = actionsMiddleware(getActiveBoardId);
const wrappedIsColumn = actionsMiddleware(isColumn);
const wrappedFindParentIdByNodeId = actionsMiddleware(findParentIdByNodeId);
const wrappedRemoveNodeById = actionsMiddleware(removeNodeById);
const wrappedAddNode = actionsMiddleware(addNode);
const wrappedGenerateNewId = actionsMiddleware(generateNewId);
const wrappedUpdateNodeWidth = actionsMiddleware(updateNodeWidth);
const wrappedNewNode = actionsMiddleware(newNode);
const wrappedUpdateTask = actionsMiddleware(updateTask);
const wrappedUpdateNodeColor = actionsMiddleware(updateNodeColor);
const wrappedChangeToUrlNode = actionsMiddleware(changeToUrlNode);
const wrappedUnsetStripColor = actionsMiddleware(unsetStripColor);
const wrappedUpdateNodeTitle = actionsMiddleware(updateNodeTitle);
const wrappedNewImageNode = actionsMiddleware(newImageNode);
const wrappedUpdateActivityCounter = actionsMiddleware(updateActivityCounter);
const wrappedReorderTasks = actionsMiddleware(reorderTasks);
const wrappedNewDocumentNode = actionsMiddleware(newDocumentNode);

export {
  wrappedUpdateNote as updateNote,
  wrappedUpdateZIndex as updateZIndex,
  wrappedUpdatePosition as updatePosition,
  updateMovingPosition,
  wrappedIncrementSelectedNodesPositions as incrementSelectedNodesPositions,
  wrappedUpdateChildPosition as updateChildPosition,
  wrappedGetActiveBoardId as getActiveBoardId,
  wrappedIsColumn as isColumn,
  findNodeById,
  wrappedFindParentIdByNodeId as findParentIdByNodeId,
  wrappedRemoveNodeById as removeNodeById,
  wrappedAddNode as addNode,
  wrappedGenerateNewId as generateNewId,
  wrappedUpdateNodeWidth as updateNodeWidth,
  wrappedNewNode as newNode,
  wrappedUpdateTask as updateTask,
  wrappedUpdateNodeColor as updateNodeColor,
  wrappedChangeToUrlNode as changeToUrlNode,
  wrappedUnsetStripColor as unsetStripColor,
  wrappedUpdateNodeTitle as updateNodeTitle,
  wrappedNewImageNode as newImageNode,
  wrappedUpdateActivityCounter as updateActivityCounter,
  wrappedReorderTasks as reorderTasks,
  wrappedNewDocumentNode as newDocumentNode,
};