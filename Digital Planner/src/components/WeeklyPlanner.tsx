import { useState, useEffect } from "react";
import { Check, Plus, X } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const CATEGORIES = [
  "Work",
  "Personal",
  "Health",
  "Learning",
  "Social",
  "Other",
];

type DayData = {
  tasks: string[];
  categories: string[];
  priority: number;
  timeBlocks: string[];
  status: boolean;
  notes: string;
};

type WeekData = {
  [key: string]: DayData;
};

export function WeeklyPlanner() {
  const [date, setDate] = useState(() => {
    const saved = localStorage.getItem("planner-date");
    return saved || "";
  });

  const [weekData, setWeekData] = useState<WeekData>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem("planner-data");
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Migrate old data format to new format
        const migratedData: WeekData = {};
        DAYS.forEach((day) => {
          if (parsedData[day]) {
            migratedData[day] = {
              // If old format (task as string), convert to array
              tasks: Array.isArray(parsedData[day].tasks)
                ? parsedData[day].tasks
                : parsedData[day].task
                  ? [parsedData[day].task]
                  : [],
              // If old format (category as string), convert to array
              categories: Array.isArray(
                parsedData[day].categories,
              )
                ? parsedData[day].categories
                : parsedData[day].category
                  ? [parsedData[day].category]
                  : [],
              priority: parsedData[day].priority || 0,
              // If old format (timeBlock as string), convert to array
              timeBlocks: Array.isArray(
                parsedData[day].timeBlocks,
              )
                ? parsedData[day].timeBlocks
                : parsedData[day].timeBlock
                  ? [parsedData[day].timeBlock]
                  : [],
              status: parsedData[day].status || false,
              notes: parsedData[day].notes || "",
            };
          } else {
            migratedData[day] = {
              tasks: [],
              categories: [],
              priority: 0,
              timeBlocks: [],
              status: false,
              notes: "",
            };
          }
        });
        return migratedData;
      } catch (e) {
        console.error("Failed to parse saved planner data");
      }
    }

    // If no saved data, create initial data
    const initialData: WeekData = {};
    DAYS.forEach((day) => {
      initialData[day] = {
        tasks: [],
        categories: [],
        priority: 0,
        timeBlocks: [],
        status: false,
        notes: "",
      };
    });
    return initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(
      "planner-data",
      JSON.stringify(weekData),
    );
  }, [weekData]);

  // Save date to localStorage
  useEffect(() => {
    localStorage.setItem("planner-date", date);
  }, [date]);

  const updateDayData = (
    day: string,
    field: keyof DayData,
    value: any,
  ) => {
    setWeekData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const addTask = (day: string) => {
    setWeekData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        tasks: [...prev[day].tasks, ""],
      },
    }));
  };

  const updateTask = (
    day: string,
    index: number,
    value: string,
  ) => {
    setWeekData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        tasks: prev[day].tasks.map((task, i) =>
          i === index ? value : task,
        ),
      },
    }));
  };

  const removeTask = (day: string, index: number) => {
    setWeekData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        tasks: prev[day].tasks.filter((_, i) => i !== index),
      },
    }));
  };

  const addCategory = (day: string, category: string) => {
    if (
      category &&
      !weekData[day].categories.includes(category)
    ) {
      setWeekData((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          categories: [...prev[day].categories, category],
        },
      }));
    }
  };

  const removeCategory = (day: string, index: number) => {
    setWeekData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        categories: prev[day].categories.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const addTimeBlock = (day: string) => {
    setWeekData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeBlocks: [...prev[day].timeBlocks, ""],
      },
    }));
  };

  const updateTimeBlock = (
    day: string,
    index: number,
    value: string,
  ) => {
    setWeekData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeBlocks: prev[day].timeBlocks.map((block, i) =>
          i === index ? value : block,
        ),
      },
    }));
  };

  const removeTimeBlock = (day: string, index: number) => {
    setWeekData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeBlocks: prev[day].timeBlocks.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const clearWeek = () => {
    const initialData: WeekData = {};
    DAYS.forEach((day) => {
      initialData[day] = {
        tasks: [],
        categories: [],
        priority: 0,
        timeBlocks: [],
        status: false,
        notes: "",
      };
    });
    setWeekData(initialData);
  };

  return (
    <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#EEC6CA] px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h1
          className="font-['Kaushan_Script',cursive] text-3xl md:text-4xl text-[#8B575C]"
          style={{
            textShadow: "2px 2px 4px rgba(139, 87, 92, 0.3)",
          }}
        >
          Weekly planner
        </h1>
        <div className="flex gap-2 items-center">
          <div className="bg-[#F5DFE1] rounded-lg px-4 py-2 hover:bg-[#F0D1D4] transition-colors">
            <input
              type="text"
              placeholder="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent font-['Aboreto',sans-serif] text-xs text-black outline-none w-24 placeholder:text-black/60"
            />
          </div>
          <button
            onClick={clearWeek}
            className="bg-[#F5DFE1] rounded-lg px-4 py-2 hover:bg-[#F0D1D4] transition-colors font-['Aboreto',sans-serif] text-xs text-black"
          >
            Clear Week
          </button>
        </div>
      </div>

      {/* Planner Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 bg-[#F5DFE1]">
            <div className="border-r border-[#D4A5AA]"></div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-4 py-6 text-center font-['Aboreto',sans-serif] text-xs border-r border-[#D4A5AA] last:border-r-0"
              >
                {day.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Task Row */}
          <div className="grid grid-cols-8 bg-[#F5DFE1]">
            <div className="px-4 py-6 font-['Aboreto',sans-serif] text-sm flex items-center border-r border-[#D4A5AA]">
              Task
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-3 border-r border-[#D4A5AA] last:border-r-0 hover:bg-white/20 transition-colors"
              >
                <div className="space-y-1.5">
                  {weekData[day].tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 group"
                    >
                      <span className="text-[#8B575C] text-xs flex-shrink-0">
                        •
                      </span>
                      <input
                        type="text"
                        value={task}
                        onChange={(e) =>
                          updateTask(day, index, e.target.value)
                        }
                        className="flex-1 bg-transparent outline-none text-xs focus:bg-white/30 rounded px-1 py-0.5 transition-colors"
                        placeholder="Task"
                      />
                      <button
                        onClick={() => removeTask(day, index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-[#8B575C] hover:text-[#6B3D42]" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addTask(day)}
                    className="flex items-center gap-1 text-[#8B575C] hover:text-[#6B3D42] transition-colors mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="text-[10px] font-['Aboreto',sans-serif]">
                      Add task
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Category Row */}
          <div className="grid grid-cols-8 bg-[#F5DFE1]">
            <div className="px-4 py-6 font-['Aboreto',sans-serif] text-sm flex items-center border-r border-[#D4A5AA]">
              category
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-3 border-r border-[#D4A5AA] last:border-r-0 hover:bg-white/20 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    {weekData[day].categories.map(
                      (category, index) => (
                        <div
                          key={index}
                          className="bg-[#EEC6CA] rounded-lg pl-2 pr-1 py-1 text-[10px] flex items-center gap-1 group hover:bg-[#E5B5BA] transition-colors"
                        >
                          <span>{category}</span>
                          <button
                            onClick={() =>
                              removeCategory(day, index)
                            }
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-2.5 h-2.5 text-[#8B575C] hover:text-[#6B3D42]" />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addCategory(day, e.target.value);
                      }
                    }}
                    className="bg-[#EEC6CA] rounded-lg pl-2 pr-1 py-1 text-[10px] outline-none cursor-pointer hover:bg-[#E5B5BA] transition-colors w-full"
                  >
                    <option value="">+ Add category</option>
                    {CATEGORIES.filter(
                      (cat) =>
                        !weekData[day].categories.includes(cat),
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Priority Row */}
          <div className="grid grid-cols-8 bg-[#F5DFE1]">
            <div className="px-4 py-6 font-['Aboreto',sans-serif] text-sm flex items-center border-r border-[#D4A5AA]">
              priority
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-4 border-r border-[#D4A5AA] last:border-r-0 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <StarRating
                  rating={weekData[day].priority}
                  onChange={(rating) =>
                    updateDayData(day, "priority", rating)
                  }
                />
              </div>
            ))}
          </div>

          {/* Time Block Row */}
          <div className="grid grid-cols-8 bg-[#F5DFE1]">
            <div className="px-4 py-6 font-['Aboreto',sans-serif] text-sm flex items-center border-r border-[#D4A5AA]">
              time block
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-2 border-r border-[#D4A5AA] last:border-r-0 hover:bg-white/20 transition-colors"
              >
                <div className="space-y-1.5">
                  {weekData[day].timeBlocks.map(
                    (block, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 group"
                      >
                        <span className="text-[#8B575C] text-xs flex-shrink-0">
                          •
                        </span>
                        <input
                          type="text"
                          value={block}
                          onChange={(e) =>
                            updateTimeBlock(
                              day,
                              index,
                              e.target.value,
                            )
                          }
                          className="flex-1 bg-transparent outline-none text-xs focus:bg-white/30 rounded px-1 py-0.5 transition-colors"
                          placeholder="Time Block"
                        />
                        <button
                          onClick={() =>
                            removeTimeBlock(day, index)
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-[#8B575C] hover:text-[#6B3D42]" />
                        </button>
                      </div>
                    ),
                  )}
                  <button
                    onClick={() => addTimeBlock(day)}
                    className="flex items-center gap-1 text-[#8B575C] hover:text-[#6B3D42] transition-colors mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="text-[10px] font-['Aboreto',sans-serif]">
                      Add time block
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Status Row */}
          <div className="grid grid-cols-8 bg-[#F5DFE1]">
            <div className="px-4 py-6 font-['Aboreto',sans-serif] text-sm flex items-center border-r border-[#D4A5AA]">
              Status
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-4 border-r border-[#D4A5AA] last:border-r-0 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <button
                  onClick={() =>
                    updateDayData(
                      day,
                      "status",
                      !weekData[day].status,
                    )
                  }
                  className={`w-7 h-7 rounded border-2 transition-all hover:scale-110 flex items-center justify-center ${
                    weekData[day].status
                      ? "bg-[#C99BA1] border-[#C99BA1]"
                      : "bg-transparent border-[#D4A5AA]"
                  }`}
                >
                  {weekData[day].status && (
                    <Check
                      className="w-5 h-5 text-[#8B6B70]"
                      strokeWidth={3}
                    />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Notes Row */}
          <div className="grid grid-cols-8 bg-[#F5DFE1]">
            <div className="px-4 py-8 font-['Aboreto',sans-serif] text-sm flex items-start pt-8 border-r border-[#D4A5AA]">
              notes
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-2 border-r border-[#D4A5AA] last:border-r-0 hover:bg-white/20 transition-colors"
              >
                <textarea
                  value={weekData[day].notes}
                  onChange={(e) =>
                    updateDayData(day, "notes", e.target.value)
                  }
                  className="w-full h-32 bg-transparent outline-none px-2 py-4 text-sm resize-none focus:bg-white/30 rounded transition-colors"
                  placeholder=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star === rating ? 0 : star)}
          className="transition-all hover:scale-110"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 44 37"
            fill={star <= rating ? "#8B575C" : "#E5D5D7"}
            className="transition-colors"
          >
            <path d="M22 0L27.0534 13.8197L41.5686 13.8197L29.7576 22.3607L34.811 36.1803L22 27.6393L9.18904 36.1803L14.2424 22.3607L2.43139 13.8197L16.9466 13.8197L22 0Z" />
          </svg>
        </button>
      ))}
    </div>
  );
}