import { SetStoreFunction } from "solid-js/store";
import { NodeType, NodeUnion, Task } from "../types";
import { writeJSON } from "./save";
import { setStore, store } from "@/components/store";

const updateTasks = (
  block_id: string,
  task_index: number,
  setStore: SetStoreFunction<NodeUnion[]>
) => {
  console.log("recieved click: ", block_id, " ", task_index);
  setStore((prev) =>
    prev.map((block) => {
      if (block.id === block_id && block.type === NodeType.Todo) {
        const updatedTasks = block.tasks?.map((task: Task, index: number) => {
          if (index === task_index) {
            return { ...task, check: !task.check };
          }
          return task;
        });

        return { ...block, tasks: updatedTasks };
      }
      return block;
    })
  );

  save();
};

const updateNote = (
  nodeId: string,
  newValue: string,
  nested: boolean = false
) => {
  // if nested
  if (nested) {
    // find parent id
  } else {
    console.log("not nested");
    console.log(nodeId);
    setStore("nodes", (nodes) =>
      nodes.map((storeNode) => {
        if (storeNode.id === nodeId) {
          return {
            ...storeNode,
            text: newValue,
          };
        }
        return storeNode;
      })
    );
  }

  save();
};

const save = () => {
  // save from setStore instead of gettign blocks()
  setTimeout(() => {
    writeJSON(store.nodes);
  }, 0);
};

export { updateNote, updateTasks };
