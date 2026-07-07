import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2, Check, X, Clock, CheckCircle, Plus, Timer } from "lucide-react";

const TaskItem = ({
  task,
  isEditing,
  onEdit,
  onDelete,
  onToggleStatus,
  onUpdateSubTasks,
}) => {
  const [confirming, setConfirming] = useState(false);
  const [adding, setAdding] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [busy, setBusy] = useState(false);

  const isDone = task.status === "completed";
  const subTasks = task.subTasks || [];
  const doneCount = subTasks.filter((s) => s.completed).length;

  const handleConfirmDelete = () => {
    setConfirming(false);
    onDelete(task._id);
  };

  const handleAddNote = async () => {
    const text = noteText.trim();
    if (!text) return;
    setBusy(true);
    // Generate a temporary Mongo-style id so the optimistic update stays valid for the backend.
    const tempId = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const next = [...subTasks, { _id: tempId, text, completed: false }];
    try {
      await onUpdateSubTasks(task._id, next);
      setNoteText("");
      setAdding(false);
    } catch {
      // no-op: parent toast handles failures
    } finally {
      setBusy(false);
    }
  };

  const handleToggleSub = async (subId) => {
    const next = subTasks.map((s) => (s._id === subId ? { ...s, completed: !s.completed } : s));

    // Debug: log current and next subtasks to help diagnose duplicate-toggle issues
    // Remove these logs after debugging
    try {
      // eslint-disable-next-line no-console
      console.debug('[TaskItem] handleToggleSub - taskId:', task._id, 'clicked subId:', subId);
      // eslint-disable-next-line no-console
      console.debug('[TaskItem] current subTasks:', JSON.parse(JSON.stringify(subTasks)));
      // eslint-disable-next-line no-console
      console.debug('[TaskItem] next subTasks:', JSON.parse(JSON.stringify(next)));
    } catch (e) {
      // ignore serialization errors
    }

    await onUpdateSubTasks(task._id, next);
  };

  const handleDeleteSub = async (subId) => {
    const next = subTasks.filter((s) => s._id !== subId);
    await onUpdateSubTasks(task._id, next);
  };

  return (
    <div
      className={`group rounded-2xl border p-5 transition-all duration-200 hover:shadow-md bg-[#EAE2D6] dark:bg-[#2B241C] ${
        isEditing
          ? "border-[#A38666] ring-2 ring-[#A38666]/20"
          : "border-[#DCD0C0] dark:border-[#4A3F32]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`truncate font-medium ${
                isDone
                  ? "text-[#8A7D6A] line-through dark:text-[#9A8B76]"
                  : "text-[#5D4E3A] dark:text-[#DCD0C0]"
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isDone
                  ? "bg-[#A38666]/15 text-[#8A7057] dark:text-[#C9A886]"
                  : "border border-[#DCD0C0] text-[#8A7D6A] dark:border-[#4A3F32] dark:text-[#9A8B76]"
              }`}
            >
              {isDone ? <CheckCircle size={12} /> : <Clock size={12} />}
              {task.status}
            </span>
            {subTasks.length > 0 && (
              <span className="shrink-0 text-xs text-[#8A7D6A] dark:text-[#9A8B76]">
                {doneCount}/{subTasks.length}
              </span>
            )}
          </div>

          {task.description && (
            <p className="mt-1.5 text-sm text-[#8A7D6A] dark:text-[#9A8B76]">{task.description}</p>
          )}
          {task.deadline && (
            <p className="mt-1.5 text-xs text-[#8A7D6A] dark:text-[#9A8B76]">
              Due: {new Date(task.deadline).toLocaleDateString()}
            </p>
          )}

          <AnimatePresence initial={false}>
            {subTasks.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-3 space-y-1.5 overflow-hidden"
              >
                {subTasks.map((sub) => (
                  <motion.li
                    key={sub._id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="group/sub flex items-center gap-2.5 rounded-xl bg-[#F5F0E6] px-3 py-2 dark:bg-[#211B14]"
                  >
                    <button
                      onClick={() => handleToggleSub(sub._id)}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        sub.completed
                          ? "border-[#A38666] bg-[#A38666] text-[#F5E0D6]"
                          : "border-[#DCD0C0] dark:border-[#4A3F32]"
                      }`}
                      aria-label={sub.completed ? "Mark incomplete" : "Mark complete"}
                    >
                      {sub.completed && <Check size={11} strokeWidth={3} />}
                    </button>
                    <span className={`flex-1 text-sm ${
                      sub.completed
                        ? "text-[#8A7D6A] line-through dark:text-[#9A8B76]"
                        : "text-[#5D4E3A] dark:text-[#DCD0C0]"
                    }`}>
                      {sub.text}
                    </span>
                    <button
                      onClick={() => handleDeleteSub(sub._id)}
                      className="opacity-0 transition-opacity group-hover/sub:opacity-100 text-[#8A7D6A] hover:text-red-600"
                      aria-label="Delete subtask"
                    >
                      <X size={14} />
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {adding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-2 overflow-hidden"
              >
                <div className="flex items-center gap-2 rounded-xl bg-[#F5F0E6] p-2 dark:bg-[#211B14]">
                  <input
                    autoFocus
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddNote();
                      if (e.key === "Escape") {
                        setAdding(false);
                        setNoteText("");
                      }
                    }}
                    placeholder="Add a subtask..."
                    className="flex-1 bg-transparent px-2 py-1 text-sm text-[#5D4E3A] placeholder:text-[#8A7D6A] focus:outline-none dark:text-[#DCD0C0]"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={busy || !noteText.trim()}
                    className="rounded-lg bg-[#A38666] px-3 py-1 text-xs font-semibold text-[#F5E0D6] transition-colors hover:bg-[#8A7057] disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#8A7D6A] transition-colors hover:text-[#A38666] dark:text-[#9A8B76]"
            >
              <Plus size={14} />
              Add note
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {confirming ? (
            <>
              <span className="mr-1 text-xs font-medium text-[#8A7D6A]">Delete?</span>
              <button
                onClick={handleConfirmDelete}
                title="Confirm"
                className="rounded-xl bg-[#A38666] p-2 text-[#F5E0D6] transition-colors hover:bg-[#8A7057]"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setConfirming(false)}
                title="Cancel"
                className="rounded-xl border border-[#DCD0C0] p-2 text-[#5D4E3A] transition-colors hover:bg-[#DCD0C0] dark:border-[#4A3F32] dark:text-[#DCD0C0] dark:hover:bg-[#4A3F32] dark:hover:text-[#EAE2D6]"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onToggleStatus(task)}
                title={isDone ? "Reopen" : "Mark done"}
                className="rounded-xl border border-[#DCD0C0] p-2 text-[#8A7D6A] transition-colors hover:bg-[#A38666]/10 hover:text-[#A38666] dark:border-[#4A3F32]"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => onEdit(task)}
                title="Edit"
                className="rounded-xl border border-[#DCD0C0] p-2 text-[#8A7D6A] transition-colors hover:bg-[#A38666]/10 hover:text-[#A38666] dark:border-[#4A3F32]"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setConfirming(true)}
                title="Delete"
                className="rounded-xl border border-[#DCD0C0] p-2 text-[#8A7D6A] transition-colors hover:bg-red-100 hover:text-red-700 dark:border-[#4A3F32]"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
