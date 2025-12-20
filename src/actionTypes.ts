import { ColorType, NodeType, NodeUnion, Task } from "./types";

export enum ActionType {
  UpdateNote = "UpdateNote",
  UpdateTask = "UpdateTask",
  UpdateZIndex = "UpdateZIndex",
  UpdatePosition = "UpdatePosition",
  IncrementSelectedNodesPositions = "IncrementSelectedNodesPositions",
  UpdateChildPosition = "UpdateChildPosition",
  UpdateNodeWidth = "UpdateNodeWidth",
  UpdateNodeColor = "UpdateNodeColor",
  UnsetStripColor = "UnsetStripColor",
  ChangeToUrlNode = "ChangeToUrlNode",
  UpdateNodeTitle = "UpdateNodeTitle",
  UpdateActivityCounter = "UpdateActivityCounter",
  ReorderTasks = "ReorderTasks",
  AddNode = "AddNode",
  RemoveNode = "RemoveNode",
  NewNode = "NewNode",
  NewImageNode = "NewImageNode",
  NewDocumentNode = "NewDocumentNode",
}
type BaseAction<T extends ActionType, V> = {
  type: T;
  nodeId?: string;
  value: V;
};
export type UpdateNoteAction = BaseAction<
  ActionType.UpdateNote,
  { text: string }
>;

export type UpdateTaskAction = BaseAction<
  ActionType.UpdateTask,
  {
    taskIndex: number;
    value: string | boolean;
  }
>;

export type UpdateZIndexAction = BaseAction<ActionType.UpdateZIndex, {}>;

export type UpdatePositionAction = BaseAction<
  ActionType.UpdatePosition,
  { x: number; y: number }
>;

export type IncrementSelectedNodesPositionsAction = BaseAction<
  ActionType.IncrementSelectedNodesPositions,
  { x: number; y: number }
>;

export type UpdateChildPositionAction = BaseAction<
  ActionType.UpdateChildPosition,
  { x: number; y: number }
>;

export type UpdateNodeWidthAction = BaseAction<
  ActionType.UpdateNodeWidth,
  { width: number }
>;

export type UpdateNodeColorAction = BaseAction<
  ActionType.UpdateNodeColor,
  {
    kind: "bg" | "fg" | "strip";
    color: ColorType;
  }
>;

export type UnsetStripColorAction = BaseAction<ActionType.UnsetStripColor, {}>;

export type ChangeToUrlNodeAction = BaseAction<
  ActionType.ChangeToUrlNode,
  { url: string }
>;

export type UpdateNodeTitleAction = BaseAction<
  ActionType.UpdateNodeTitle,
  { title: string }
>;

export type UpdateActivityCounterAction = BaseAction<
  ActionType.UpdateActivityCounter,
  {
    date: string;
    delta: number;
  }
>;

export type ReorderTasksAction = BaseAction<
  ActionType.ReorderTasks,
  { tasks: Task[] }
>;

export type AddNodeAction = BaseAction<
  ActionType.AddNode,
  {
    node: NodeUnion;
    targetNodeId?: string;
  }
>;

export type RemoveNodeAction = BaseAction<
  ActionType.RemoveNode,
  { parentId?: string }
>;

export type NewNodeAction = BaseAction<
  ActionType.NewNode,
  { type: NodeType; x: number; y: number }
>;

export type NewImageNodeAction = BaseAction<
  ActionType.NewImageNode,
  { img: string; x: number; y: number }
>;

export type NewDocumentNodeAction = BaseAction<
  ActionType.NewDocumentNode,
  {
    path: string;
    x: number;
    y: number;
    docType: string;
  }
>;
export type Action =
  | UpdateNoteAction
  | UpdateTaskAction
  | UpdateZIndexAction
  | UpdatePositionAction
  | IncrementSelectedNodesPositionsAction
  | UpdateChildPositionAction
  | UpdateNodeWidthAction
  | UpdateNodeColorAction
  | UnsetStripColorAction
  | ChangeToUrlNodeAction
  | UpdateNodeTitleAction
  | UpdateActivityCounterAction
  | ReorderTasksAction
  | AddNodeAction
  | RemoveNodeAction
  | NewNodeAction
  | NewImageNodeAction
  | NewDocumentNodeAction;
