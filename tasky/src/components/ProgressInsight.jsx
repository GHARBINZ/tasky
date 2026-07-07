import { useMemo } from "react";
import { motion } from "framer-motion";

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return false;
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};

const ProgressInsight = ({ tasks = [], mode = "deadline" }) => {
  const { percent, completed, total } = useMemo(() => {
    const DATE_FIELD = mode === "deadline" ? "deadline" : "createdAt";
    const today = new Date();

    const anyHaveDate = tasks.some((t) => t[DATE_FIELD]);
    if (tasks.length > 0 && !anyHaveDate) {
      console.warn(
        `[ProgressInsight] No task has a "${DATE_FIELD}" field. Actual keys: ${
          tasks[0] ? Object.keys(tasks[0]).join(", ") : "no tasks"
        }`
      );
    }

    const todays = tasks.filter((task) => {
      const raw = task[DATE_FIELD];
      if (!raw) return false;
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return false;
      return isSameDay(date, today);
    });
    const total = todays.length;
    const completed = todays.filter((task) => task.status === "completed").length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { percent, completed, total };
  }, [tasks, mode]);

  const size = 54;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  if (total === 0) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAE2D6]"
        >
          <span className="text-xs font-semibold text-[#8A7D6A]">—</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#5D4E3A] dark:text-[#EDE4D3]">
            No tasks are due today.
          </p>
          <p className="text-xs text-[#8A7D6A] dark:text-[#9A8B76]">
            Add a task with today’s deadline to start tracking progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#EAE2D6] dark:bg-[#2B241C]">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#DCD0C0"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#A38666"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <motion.span
          key={percent}
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
          className="absolute text-sm font-bold text-[#5D4E3A] dark:text-[#EDE4D3]"
        >
          {percent}%
        </motion.span>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#5D4E3A] dark:text-[#EDE4D3]">
          Progress today
        </p>
        <p className="text-sm text-[#8A7D6A] dark:text-[#9A8B76]">
          {completed} of {total} task{total === 1 ? "" : "s"} completed.
        </p>
      </div>
    </div>
  );
};

export default ProgressInsight;
