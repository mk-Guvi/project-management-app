// store/useTasks.ts
import { create } from "zustand";
import axios from "axios";
import axiosInstance from "@/utils/backend";

export interface TaskDocument {
  task_name: string;
  task_id: string;
  task_description: string;
  status: "in_progress" | "todo" | "done";
  created_at?: string;
  updated_at?: string;
}
export type FetchTaskPayloadT = { sortBy: string; search: string };
interface TaskState {
  tasks: TaskDocument[];
  fetchTasks: ({
    sortBy,
    search,
  }: FetchTaskPayloadT) => Promise<TaskDocument[]>;
  createTask: (task: Partial<TaskDocument>) => Promise<null | TaskDocument>;
  updateTask: (
    id: string,
    updatedTask: Partial<TaskDocument>
  ) => Promise<null | TaskDocument>;
  deleteTask: (id: string) => Promise<boolean>;
}

const useTasksStore = create<TaskState>((set) => ({
  tasks: [],
  fetchTasks: async ({ search, sortBy }) => {
    try {
      const response = await axiosInstance.get(
        `/api/tasks?sortBy=${sortBy}&search=${search}`
      );
      set({ tasks: response.data?.data?.tasks || [] });
      return response?.data || [];
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      return [];
    }
  },
  createTask: async (task) => {
    try {
      const response = await axiosInstance.post("/api/tasks", task);
      if (response?.data?.type === "success") {
        set((state) => ({ tasks: [...state.tasks, response.data.data] }));
        return response.data.data as TaskDocument;
      } else {
        throw new Error(response?.data?.message || "Failed add task");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      return null;
    }
  },
  updateTask: async (id, updatedTask) => {
    let prev_data = updatedTask;
    try {
      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.task_id === id) {
            prev_data = task;
            return { ...task, ...updatedTask };
          }

          return task;
        }),
      }));
      const response = await axiosInstance.put(`/api/tasks/${id}`, updatedTask);
      if (response?.data?.type === "success") {
        return response.data.data as TaskDocument;
      } else {
        throw new Error(response?.data?.message || "Failed add task");
      }
    } catch (error) {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.task_id === id ? { ...task, ...prev_data } : task
        ),
      }));
      console.error("Failed to update task:", error);
      return null;
    }
  },
  deleteTask: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/tasks/${id}`);
      if (response?.data?.type === "success") {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.task_id !== id),
        }));
        return true;
      }
      throw new Error(response?.data?.message || "Error in deleting");
    } catch (error) {
      console.error("Failed to delete task:", error);
      return false;
    }
  },
}));

export default useTasksStore;
