import { SetStoreFunction } from "solid-js/store";
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
import { setStore, store } from "@/shared/store";
import { saveChanges } from "./utils";

const updateTask = (
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

//? update Note text content
const updateNote = (nodeId: string, newValue: string) => {
  for (const [parentId, nodeList] of Object.entries(store.nodes)) {
    const index = nodeList.findIndex((n) => n.id === nodeId);
    if (index !== -1) {
      setStore("nodes", parentId, index, "text", newValue);
      break;
    }
  }

  saveChanges();
};

const getActiveBoardId = (): string => {
  return store.activeBoards[store.activeBoards.length - 1].id;
};

//? on dragstart, increase the z index of dragged node to make appear on top always
//TODO: change to indlude only the current active board
//TODO: change to include child elemnts as well
const updateZIndex = (nodeId: string) => {
  const activeBoardId = getActiveBoardId();
  if (!activeBoardId) return;

  const boardNodes = store.nodes[activeBoardId] ?? [];
  const max_z_index = Math.max(...boardNodes.map((node) => node.zIndex ?? 0));

  const index = boardNodes.findIndex((n) => n.id === nodeId);
  if (index !== -1) {
    setStore("nodes", activeBoardId, index, "zIndex", max_z_index + 1);
  }

  // no need to save here
};

//? update node position
const updatePosition = (nodeId: string, x: number, y: number) => {
  const activeBoardId = getActiveBoardId();
  const boardNodes = store.nodes[activeBoardId] ?? [];

  const index = boardNodes.findIndex((n) => n.id === nodeId);
  if (index !== -1) {
    if (x > 0) setStore("nodes", activeBoardId, index, "x", x);
    if (y > 0) setStore("nodes", activeBoardId, index, "y", y);
  }

  saveChanges();
};
//? update node position for arrow keys
const incremenSelectedNodesPositions = (x: number, y: number) => {
  store.selectedNodes.forEach((selectedNode) => {
    console.info("incrementing position of node:", selectedNode, x, y);

    const activeBoardId = getActiveBoardId();
    const boardNodes = store.nodes[activeBoardId] ?? [];

    const index = boardNodes.findIndex((n) => n.id === selectedNode);
    if (index !== -1) {
      if (x) setStore("nodes", activeBoardId, index, "x", (prev) => prev + x);
      if (y) setStore("nodes", activeBoardId, index, "y", (prev) => prev + y);
    }
  });
  saveChanges();
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
  console.info("removing the node:", nodeId);
  let space;
  if (parentId) {
    space = parentId;
  } else {
    space = getActiveBoardId();
  }

  const updated = store.nodes[space]?.filter((n) => n.id !== nodeId);
  if (updated) {
    setStore("nodes", space, updated);
  }

  saveChanges();
};

const addNode = (
  newNode: NodeUnion,
  // x: number,
  // y: number,
  //* if is set to tru, node is sent to active board = canvas
  //* if it is set, node is sent to another node
  targetNodeId?: string
) => {
  console.info("adding the node:", newNode);

  if (targetNodeId) {
    setStore("nodes", targetNodeId, (nodes = []) => [...nodes, newNode]);
  } else {
    const activeBoardId = getActiveBoardId();
    setStore("nodes", activeBoardId, (nodes = []) => [...nodes, newNode]);
  }

  saveChanges();
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
        tasks: [],
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
      } as Activity;

    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
};

const newNode = (type: NodeType, x: number, y: number) => {
  const activeBoardId = getActiveBoardId();

  //todo: adjust the x and y to scale as well

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

//? update node colors, fg or bg or strip
const updateNodeColor = (
  nodeId: string,
  type: "bg" | "fg" | "strip",
  color: ColorType
) => {
  const activeBoardId = getActiveBoardId();
  const boardNodes = store.nodes[activeBoardId] ?? [];

  const index = boardNodes.findIndex((n) => n.id === nodeId);
  if (index !== -1) {
    switch (type) {
      case "bg":
        setStore("nodes", activeBoardId, index, "color", color);
        break;
      case "fg":
        setStore("nodes", activeBoardId, index, "textColor", color);
        break;
      case "strip":
        setStore("nodes", activeBoardId, index, "top_strip_color", color);
        break;
      default:
        break;
    }
  }

  saveChanges();
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

export {
  updateNote,
  updateZIndex,
  updatePosition,
  incremenSelectedNodesPositions,
  updateChildPosition,
  getActiveBoardId,
  isColumn,
  findNodeById,
  findParentIdByNodeId,
  removeNodeById,
  addNode,
  generateNewId,
  updateNodeWidth,
  newNode,
  updateTask,
  updateNodeColor,
  changeToUrlNode,
  unsetStripColor,
};
