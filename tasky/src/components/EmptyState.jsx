import { motion } from "framer-motion";

const EmptyState = ({
  title = "No tasks yet",
  subtitle = "Add your first task above to get started.",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#A38666]/30 bg-[#EAE2D6]/50 px-6 py-14 text-center dark:bg-[#2B241C]/50"
    >
      <div className="mb-5 text-[#A38666] opacity-70 dark:text-[#C9A886]">
        <svg
          width="72"
          height="72"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M26 10c-1.5 2-1.5 4 0 6M32 8c-1.5 2.5-1.5 5 0 7.5M38 10c-1.5 2-1.5 4 0 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M16 26h30v11c0 6.6-5.4 12-12 12h-6c-6.6 0-12-5.4-12-12V26z"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M46 29h4a6 6 0 0 1 0 12h-4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M14 54h34"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-[#5D4E3A] dark:text-[#DCD0C0]">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-[#8A7D6A] dark:text-[#9A8B76]">{subtitle}</p>
    </motion.div>
  );
};

export default EmptyState;
