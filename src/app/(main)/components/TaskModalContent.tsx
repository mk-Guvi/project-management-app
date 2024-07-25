"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useTasksStore, { TaskDocument } from "@/store/taskStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/providers/modalProvider";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  task_name: z.string().min(1, "Task name is required"),
  task_description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
});

interface TaskModalProps {
  task?: TaskDocument;
}

const TaskModalContent: React.FC<TaskModalProps> = ({ task }) => {
  const { clearState } = useModal();
  const { createTask, updateTask } = useTasksStore();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task_name: task?.task_name || "",
      task_description: task?.task_description || "",
      status: task?.status || "todo",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError('')
      if (task) {
        const response = await updateTask(task.task_id, values);
        if (response) {
          toast({ variant: "success", description: "Successfully updated." });
        } else {
          throw new Error("Failed to add task");
        }
      } else {
        const response = await createTask(values);
        if (response) {
          toast({ variant: "success", description: "Successfully added." });
        } else {
          throw new Error("Failed to add task");
        }
      }
      clearState();
    } catch (error) {
      setError("Failed to save task.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="task_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter task name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="task_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="todo">TODO</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2 mt-3">
          <p className="flex-1 text-red-500">{error||""}</p>
          <Button type="button" variant="outline" onClick={clearState}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskModalContent;
