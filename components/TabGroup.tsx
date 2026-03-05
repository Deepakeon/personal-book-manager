import { motion } from "framer-motion";

interface DropdownProps {
  activeKey: string;
  items: { key: string; label: string }[];
  onChange: (activeKey: string) => void;
}

const TabGroup = ({ activeKey, items, onChange }: DropdownProps) => {
  return (
    <div className="flex gap-1 pb-2 overflow-x-hidden px-2">
      {items?.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className="relative px-4 py-2 text-sm font-sans font-medium whitespace-nowrap rounded-full transition-colors"
        >
          {activeKey === item.key && (
            <motion.div
              layoutId="tab-highlight"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}

          <span
            className={`relative z-10 ${
              activeKey === item.key
                ? "text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabGroup;