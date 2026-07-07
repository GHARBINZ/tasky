import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";

const TaskCalendar = ({ tasks = [], onSelectDate }) => {
  const [value, setValue] = useState(new Date());

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!task.deadline) return;
      const date = new Date(task.deadline);
      const key = date.toDateString();
      (map[key] = map[key] || []).push(task);
    });
    return map;
  }, [tasks]);

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dayTasks = tasksByDate[date.toDateString()];
    if (!dayTasks || dayTasks.length === 0) return null;

    const hasPending = dayTasks.some((task) => task.status === "pending");

    return (
      <div className="mt-1 flex items-center justify-center gap-0.5">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            hasPending ? "bg-[#A38666]" : "bg-[#A38666]/40"
          }`}
        />
        {dayTasks.length > 1 && (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#A38666]/60" />
        )}
      </div>
    );
  };

  const selectedTasks = tasksByDate[value.toDateString()] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="earth-calendar rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] p-4 dark:border-[#4A3F32] dark:bg-[#2B241C]"
    >
      <Calendar
        onChange={(date) => {
          setValue(date);
          onSelectDate?.(date);
        }}
        value={value}
        tileContent={tileContent}
        className="earth-calendar-inner"
      />

      <div className="mt-4 border-t border-[#DCD0C0] pt-4 dark:border-[#4A3F32]">
        <h4 className="mb-2 text-sm font-semibold text-[#5D4E3A] dark:text-[#DCD0C0]">
          {value.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h4>
        {selectedTasks.length === 0 ? (
          <p className="text-sm text-[#8A7D6A] dark:text-[#9A8B76]">No tasks due this day.</p>
        ) : (
          <ul className="space-y-1.5">
            {selectedTasks.map((task) => (
              <li
                key={task._id}
                className="flex items-center gap-2 text-sm text-[#5D4E3A] dark:text-[#DCD0C0]"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    task.status === "completed" ? "bg-[#A38666]/40" : "bg-[#A38666]"
                  }`}
                />
                <span className={task.status === "completed" ? "line-through opacity-60" : ""}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCalendar;
