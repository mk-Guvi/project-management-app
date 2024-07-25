"use client"
import React, { useState } from "react";
import useTasksStore, { TaskDocument } from "@/store/taskStore";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modalProvider";
import { toast } from "@/components/ui/use-toast";

interface TaskModalProps {
  task: TaskDocument;
}

const TaskDeleteModalContent: React.FC<TaskModalProps> = ({ task }) => {
  const { clearState } = useModal();
  const { deleteTask } = useTasksStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleDelete = async () => {
    setLoading(true);
    setError("");
    const response = await deleteTask(task.task_id);
    if (response) {
      clearState();
      toast({ variant: "success", description: "Deleted Successfully." });
    } else {
      setError("Failed to delete");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm">
        Are you sure, you want to delete{" "}
        <span className="text-gray-700 text-sm font-medium tracking-wide">
          {task?.task_name}
        </span>{" "}
        task ?
      </div>
      <footer className="flex items-center gap-2">
        <p className="flex-1 text-xs tracking-wide font-medium text-red-500">
          {error || ""}
        </p>
        <Button variant="outline" onClick={clearState} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleDelete} disabled={loading}>
          Delete
        </Button>
      </footer>
    </div>
  );
};

export default TaskDeleteModalContent;
