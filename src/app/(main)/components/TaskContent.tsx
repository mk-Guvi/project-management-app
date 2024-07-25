import React from "react";
import { Button } from "@/components/ui/button";
import { TaskDocument } from "@/store/taskStore";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";
import dayjs from "dayjs";
import { Draggable } from "react-beautiful-dnd";

interface TaskComponentProps {
  task: TaskDocument;
  index: number;
  onEdit: (task: TaskDocument) => void;
  onDelete: (task: TaskDocument) => void;
}

const TaskComponent: React.FC<TaskComponentProps> = ({
  task,
  index,
  onDelete,
  onEdit,
}) => {
  const formattedCreatedAt = useMemo(
    () => dayjs(task.created_at).format("DD/MM/YYYY HH:mm:ss"),
    [task.created_at]
  );

  return (
    <Draggable draggableId={task.task_id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="m-2 rounded-md border h-[10rem] flex flex-col gap-2 shadow bg-background p-3"
        >
          <h3
            className="font-semibold truncate tracking-wide text-sm"
            title={task.task_name}
          >
            {task.task_name}
          </h3>
          <p className="text-xs truncate" title={task.task_description}>
            {task.task_description}
          </p>
          <p className="text-sm">Created at: {formattedCreatedAt}</p>
          <div className="inline-flex gap-2 justify-end w-full items-center">
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <Edit2Icon size={14} />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              size={"sm"}
              variant={"destructive"}
            >
              <Trash2Icon size={14} />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskComponent;
