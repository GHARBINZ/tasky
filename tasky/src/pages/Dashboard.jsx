import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import * as taskService from "../services/taskService.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";
import TaskSkeleton from "../components/TaskSkeleton.jsx";
import TaskCalendar from "../components/TaskCalendar.jsx";
import ProgressInsight from "../components/ProgressInsight.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Navbar from "../components/Navbar.jsx";
import { CATEGORIES } from "../utils/categorize.js";
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await taskService.getTasks();
        if (active) setTasks(data);
      } catch {
        if (active) setError("Failed to load tasks.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (payload) => {
    const newTask = await taskService.createTask(payload);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdate = async (payload) => {
    const updated = await taskService.updateTask(editingTask._id, payload);
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await taskService.deleteTask(id);
      toast("Task deleted.", {
        icon: "🗑️",
      });
    } catch {
      setError("Failed to delete task.");
      setTasks(previous);
      toast.error("Could not delete the task.");
    }
    if (editingTask?._id === id) setEditingTask(null);
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const updated = await taskService.updateTask(task._id, {
        status: nextStatus,
      });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      if (nextStatus === "completed") {
        toast.success("Task complete — nice work!");
      } else {
        toast("Task reopened", { icon: "↩️" });
      }
    } catch {
      toast.error("Could not update the task.");
    }
  };

  const handleUpdateSubTasks = async (taskId, newSubTasks) => {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, subTasks: newSubTasks } : t)));

    // Debug: log the payload being sent to the server
    try {
      // eslint-disable-next-line no-console
      console.debug('[Dashboard] handleUpdateSubTasks - taskId:', taskId, 'newSubTasks:', JSON.parse(JSON.stringify(newSubTasks)));
    } catch (e) {
      // ignore
    }
    try {
      await taskService.updateTask(taskId, { subTasks: newSubTasks });
    } catch {
      setTasks(previous);
      toast.error("Could not save subtasks.");
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleTasks = tasks.filter((t) => {
    const matchesSearch =
      !normalizedSearch || t.title.toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#5D4E3A] dark:bg-[#211B14] dark:text-[#DCD0C0]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/* 12-col grid: stacked on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">

          {/* LEFT COLUMN — Progress + Add Task form (4/12) */}
          <aside className="md:col-span-4 md:sticky md:top-8 md:self-start">
            <motion.section
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mb-6 rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] p-5 shadow-sm dark:border-[#4A3F32] dark:bg-[#2B241C]"
            >
              <ProgressInsight tasks={tasks} mode="deadline" />
            </motion.section>

            <section className="rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] p-6 shadow-sm dark:border-[#4A3F32] dark:bg-[#2B241C]">
              <h2 className="mb-4 text-lg font-semibold text-[#5D4E3A] dark:text-[#DCD0C0]">
                {editingTask ? "Edit Task" : "Add a Task"}
              </h2>
              <TaskForm
                key={editingTask?._id || "create"}
                onSubmit={editingTask ? handleUpdate : handleCreate}
                initialValues={editingTask}
                onCancel={() => setEditingTask(null)}
              />
            </section>
          </aside>

          {/* RIGHT COLUMN — search + filters + task list (8/12) */}
          <section className="md:col-span-8">
            <h2 className="mb-4 text-lg font-semibold text-[#5D4E3A] dark:text-[#DCD0C0]">
              Your Tasks
            </h2>

            {/* Search bar */}
            <div className="relative mb-4">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7D6A]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks by title..."
                className="w-full rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] py-2.5 pl-11 pr-4 text-sm text-[#5D4E3A] placeholder:text-[#8A7D6A] focus:border-[#A38666] focus:outline-none focus:ring-2 focus:ring-[#A38666]/20 dark:border-[#4A3F32] dark:bg-[#2B241C] dark:text-[#DCD0C0]"
              />
            </div>

            {/* Category filter pills */}
            <div className="mb-5 flex flex-wrap gap-2">
              {['All', ...CATEGORIES].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#A38666] text-[#F5F0E6]"
                          : "border border-[#DCD0C0] bg-[#EAE2D6] text-[#5D4E3A] hover:bg-[#DCD0C0] " +
                            "dark:border-[#4A3F32] dark:bg-[#2B241C] dark:text-[#DCD0C0] dark:hover:bg-[#4A3F32] dark:hover:text-[#EAE2D6]"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* States + list */}
            {loading && (
              <div className="grid gap-3">
                <TaskSkeleton /><TaskSkeleton /><TaskSkeleton />
              </div>
            )}
            {error && <p className="text-sm text-red-700">{error}</p>}
            {!loading && !error && tasks.length === 0 && <EmptyState />}
            {!loading && !error && tasks.length > 0 && visibleTasks.length === 0 && (
              <EmptyState title="Nothing matches" subtitle={`No tasks found for "${search}".`} />
            )}

            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {visibleTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <TaskItem
                      task={task}
                      isEditing={editingTask?._id === task._id}
                      onEdit={setEditingTask}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                      onFocus={setEditingTask}
                      onUpdateSubTasks={handleUpdateSubTasks}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* Focus mode overlay stays outside the grid */}
      {/* (If you have a FocusMode component, render it here similar to previous implementations) */}
    </div>
  );
};

export default Dashboard;
