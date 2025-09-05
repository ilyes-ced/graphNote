import { SetStoreFunction } from "solid-js/store";
import { Block_type, BlockUnion, Task } from "../types";
import { writeJSON } from "../components/save";

const updateBlockPos = async (
  id: string,
  x: number,
  y: number,
  setBlocks: SetStoreFunction<BlockUnion[]>
) => {
  //? moving the blocks around, update the data object and save to file
  // todo: get the values, set the x and y to those values then reset the translate values to 0

  setBlocks(
    (block) => block.id === id,
    (block) => ({
      ...block,
      x: x,
      y: y,
    })
  );
  // Get the updated version AFTER setBlocks and write it
  setTimeout(() => {
    // Capture latest snapshot
    setBlocks((current) => {
      writeJSON(current);
      return current;
    });
  }, 0);
};

const updateTasks = (
  block_id: string,
  task_index: number,
  setBlocks: SetStoreFunction<BlockUnion[]>
) => {
  console.log("recieved click: ", block_id, " ", task_index);
  setBlocks((prev) =>
    prev.map((block) => {
      if (block.id === block_id && block.type === Block_type.Todo) {
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
  // Get the updated version AFTER setBlocks and write it
  setTimeout(() => {
    // Capture latest snapshot
    setBlocks((current) => {
      writeJSON(current);
      return current;
    });
  }, 0);
};

export { updateBlockPos, updateTasks };
