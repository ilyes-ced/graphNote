import { SetStoreFunction } from "solid-js/store";
import { NodeType, NodeUnion, Task } from "../types";
import { writeJSON } from "../components/save";

// probably uneeded as it is done in useDraggableBlock.ts
const updateBlockPos = async (
  id: string,
  x: number,
  y: number,
  setBlocks: SetStoreFunction<NodeUnion[]>
) => {
  setBlocks(
    (block) => block.id === id,
    (block) => ({
      ...block,
      x: x,
      y: y,
    })
  );

  save(setBlocks);
};

const updateTasks = (
  block_id: string,
  task_index: number,
  setBlocks: SetStoreFunction<NodeUnion[]>
) => {
  console.log("recieved click: ", block_id, " ", task_index);
  setBlocks((prev) =>
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

  save(setBlocks);
};

const save = (setBlocks: SetStoreFunction<NodeUnion[]>) => {
  // save from setBlocks instead of gettign blocks()
  setTimeout(() => {
    setBlocks((current) => {
      writeJSON(current);
      return current;
    });
  }, 0);
};

export { updateBlockPos, updateTasks };
