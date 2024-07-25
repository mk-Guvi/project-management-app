"use client";
import React from "react";
import { TaskDocument } from "@/store/taskStore";
import TaskContent from "./TaskContent";
import { Droppable } from "react-beautiful-dnd";
import { TaskStatus } from "../page";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskListProps {
  title: string;
  droppableId: TaskStatus;
  tasks: TaskDocument[];
  onEdit: (task: TaskDocument) => void;
  onDelete: (task: TaskDocument) => void;
  loading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  title,
  droppableId,
  tasks,
  onEdit,
  onDelete,
  loading,
}) => {
  return (
    <Droppable
      droppableId={droppableId}
      isDropDisabled={loading}
      type="COLUMN"
      direction="vertical"
      isCombineEnabled={true}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 border rounded-md max-w-[25rem] flex flex-col w-full shadow bg-background overflow-y-auto !overflow-x-hidden
            ${snapshot.isDraggingOver ? "bg-gray-50" : ""}
            ${snapshot.draggingFromThisWith ? "bg-blue-50" : ""}`}
        >
          <h2 className="p-3 bg-gray-100 border-b text-sm font-semibold tracking-wide">
            {title}
          </h2>
          <div className="flex-1 overflow-y-auto">
            {loading
              ? [1, 2, 3].map((e) => {
                  return (
                    <Skeleton
                      key={e}
                      className="h-40 rounded-md shadow-md m-2 my-3"
                    />
                  );
                })
              : tasks.map((task, index) => (
                  <TaskContent
                    key={task.task_id}
                    task={task}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
