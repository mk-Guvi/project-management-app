import { create } from "zustand";
import {
  BackendGet,
  BackendPost,
  BackendPut,
  BackendDelete,
} from "@/utils/backend";

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
  fetchTasks: ({ sortBy, search }: FetchTaskPayloadT) => Promise<TaskDocument[]>;
  createTask: (task: Partial<TaskDocument>) => Promise<null | TaskDocument>;
  updateTask: (id: string, updatedTask: Partial<TaskDocument>) => Promise<null | TaskDocument>;
  deleteTask: (id: string) => Promise<boolean>;
}

const useTasksStore = create<TaskState>((set) => ({
  tasks: [],
  fetchTasks: async ({ search, sortBy }) => {
    try {
      const response = await BackendGet<{ data: { tasks: TaskDocument[] } }>({
        path: `/api/tasks`,
        headers: {
          'X-API-NAME': 'fetchTasks',
        },
        config: {
          params: { sortBy, search },
        },
      });
      set({ tasks: response.data?.tasks || [] });
      return response.data?.tasks || [];
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      return [];
    }
  },
  createTask: async (task) => {
    try {
      const response = await BackendPost<{ data: TaskDocument }>({
        path: `/api/tasks`,
        data: task,
        headers: {
          'X-API-NAME': 'createTask',
        },
      });
      if (response.data) {
        set((state) => ({
          tasks: [...state.tasks, response.data]
        }));
        return response.data;
      } else {
        throw new Error("Failed to add task");
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
      const response = await BackendPut<{ data: TaskDocument,type?:"success"|"error" }>({
        path: `/api/tasks/${id}`,
        data: updatedTask,
        headers: {
          'X-API-NAME': 'updateTask',
        },
      });
      if (response?.type === "success") {
        return response.data as TaskDocument;
      } else {
        throw new Error("Failed to update task");
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
      const response = await BackendDelete<{ data: null }>({
        path: `/api/tasks/${id}`,
        headers: {
          'X-API-NAME': 'deleteTask',
        },
      });
      if (response.data === null) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.task_id !== id),
        }));
        return true;
      }
      throw new Error("Error in deleting task");
    } catch (error) {
      console.error("Failed to delete task:", error);
      return false;
    }
  },
}));

export default useTasksStore;
