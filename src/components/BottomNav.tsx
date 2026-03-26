import { Home, Bookmark, Search } from "lucide-react";
import { motion } from "framer-motion";

export type TabType = "feed" | "bookmarks" | "search";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  bookmarkCount?: number;
}

const tabs = [
  { id: "feed" as TabType, icon: Home, label: "Feed" },
  { id: "bookmarks" as TabType, icon: Bookmark, label: "Saved" },
  { id: "search" as TabType, icon: Search, label: "Search" },
];

const BottomNav = ({ activeTab, onTabChange, bookmarkCount = 0 }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-6 py-2"
            >
              <div className="relative">
                <tab.icon
                  className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                {tab.id === "bookmarks" && bookmarkCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {bookmarkCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0.5 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
