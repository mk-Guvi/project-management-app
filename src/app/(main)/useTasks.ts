"use client";
import { useChangeListener } from "@/hooks.ts";
import useTasksStore from "@/store/taskStore";
import { useEffect, useState } from "react";

const useTasks = () => {
  const taskStore = useTasksStore();
  const [sortBy, setSortBy] = useState("created_at");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [changeWatcher, recordChanges] = useChangeListener(500);
  
  useEffect(() => {
    getTasks();
  }, [changeWatcher]);

  const getTasks = async () => {
    setLoading(true);
    await taskStore.fetchTasks({ sortBy, search });
    setLoading(false);
  };

  return {
    ...taskStore,
    getTasks,
    loading,
    setSortBy,
    setSearch,
    recordChanges,
    search,
    sortBy,
  };
};

export default useTasks;
