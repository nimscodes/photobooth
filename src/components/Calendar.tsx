"use client";

import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isBefore, startOfDay, addMonths, subMonths, getDay,
} from "date-fns";

interface CalendarProps {
  unavailableDates: string[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export default function Calendar({ unavailableDates, selectedDate, onSelectDate }: CalendarProps) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(today);

  const days = eachDayOfInterval({ start: startOfMonth(viewMonth), end: endOfMonth(viewMonth) });
  const blanks = Array.from({ length: getDay(startOfMonth(viewMonth)) });

  const isUnavailable = (d: Date) =>
    unavailableDates.includes(format(d, "yyyy-MM-dd")) || isBefore(d, today);
  const isSelected = (d: Date) => !!selectedDate && isSameDay(d, selectedDate);
  const isToday = (d: Date) => isSameDay(d, today);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          disabled={isBefore(subMonths(viewMonth, 1), startOfMonth(today))}
          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-lg">
          ‹
        </button>
        <span className="font-semibold text-white">{format(viewMonth, "MMMM yyyy")}</span>
        <button type="button" onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="p-2 rounded-lg hover:bg-white/10 text-white text-lg">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-white/40 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map((day) => {
          const unavail = isUnavailable(day);
          const sel = isSelected(day);
          const tod = isToday(day);
          return (
            <button key={day.toISOString()} type="button" disabled={unavail}
              onClick={() => onSelectDate(day)}
              className={["aspect-square rounded-lg text-sm font-medium transition-all",
                unavail ? "text-white/20 cursor-not-allowed line-through"
                  : sel ? "bg-[#c9a84c] text-[#0f0f1a] font-bold shadow-lg"
                  : tod ? "ring-1 ring-[#c9a84c]/60 text-white hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              ].join(" ")}>
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#c9a84c] inline-block" /> Selected</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white/10 inline-block" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white/5 inline-block" /><span className="line-through">Unavailable</span></span>
      </div>
    </div>
  );
}
