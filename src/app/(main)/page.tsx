"use client";
import React, { useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import useTasks, { TaskStatus } from "./useTasks";
import TaskList from "./components/TaskList";
import { TaskDocument } from "@/store/taskStore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modalProvider";
import TaskModalContent from "./components/TaskModalContent";
import TaskDeleteModalContent from "./components/TaskDeleteModalContent";

const TaskBoardPage: React.FC = () => {
  const { handleState } = useModal();
  const {
    tasks,
    updateTask,
    search,
    loading,
    sortBy,
    recordChanges,
    setSearch,
    setSortBy,
  } = useTasks();

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination, draggableId } = result;

      if (source.droppableId !== destination.droppableId) {
        const task = tasks.find((t) => t?.task_id === draggableId);
        
        if (task) {
          updateTask(task.task_id, {
            status: destination.droppableId as TaskDocument["status"],
            task_name: task.task_name,
            task_description: task.task_description,
          });
        }
      }
    },
    [tasks, updateTask]
  );

  const filteredTasks = useCallback(
    (status: TaskStatus) => tasks?.filter((task) => task?.status === status),
    [tasks]
  );

  const openModal = useCallback(
    (title: string, content: React.ReactNode) => {
      handleState({
        open: true,
        title,
        description: "",
        content,
      });
    },
    [handleState]
  );

  const onOpenCreateTaskModal = useCallback(
    () => openModal("Create Task", <TaskModalContent />),
    [openModal]
  );

  const onOpenEditTaskModal = useCallback(
    (task: TaskDocument) =>
      openModal("Edit Task", <TaskModalContent task={task} />),
    [openModal]
  );

  const onOpenDeleteTaskModal = useCallback(
    (task: TaskDocument) =>
      openModal("Delete Task", <TaskDeleteModalContent task={task} />),
    [openModal]
  );

  const renderTaskList = useCallback(
    (status: TaskStatus, title: string) => (
      <div
        className={`min-w-[20rem] flex-1 border rounded-md  max-w-[45rem] flex flex-col shadow bg-background overflow-y-auto !overflow-x-hidden
            `}
      >
        <TaskList
          title={title}
          tasks={filteredTasks(status)}
          droppableId={status}
          onEdit={onOpenEditTaskModal}
          loading={loading}
          onDelete={onOpenDeleteTaskModal}
        />
      </div>
    ),
    [filteredTasks, onOpenEditTaskModal, onOpenDeleteTaskModal, loading]
  );

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <header className="flex items-center gap-2 flex-wrap ">
        <div className="flex-1">
          <Input
            placeholder="Search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              recordChanges();
            }}
            className="max-w-[15rem] min-w-[8rem]"
          />
        </div>
        <div className="inline-flex gap-2  w-auto items-center ">
          {" "}
          <p className="text-sm text-nowrap ">Sort By</p>
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value), recordChanges();
            }}
          >
            <SelectTrigger className="max-w-[130px]">
              <SelectValue placeholder="sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created At</SelectItem>
              <SelectItem value="updated_at">Updated At</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onOpenCreateTaskModal}>Add task</Button>
      </header>
      <div className="scrollbar-hide min-h-[27rem] bg-black flex flex-1  overflow-auto gap-3 py-2 h-full w-full">
        <DragDropContext onDragEnd={handleDragEnd}>
          {renderTaskList(TaskStatus.TODO, "TODO")}

          {renderTaskList(TaskStatus.IN_PROGRESS, "In Progress")}

          {renderTaskList(TaskStatus.DONE, "DONE")}
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskBoardPage;
