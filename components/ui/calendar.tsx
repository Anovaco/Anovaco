"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("anova-calendar", className)}
      classNames={{
        months: "rdp-months",
        month: "rdp-month",
        caption: "rdp-caption",
        caption_label: "rdp-caption_label",
        nav: "rdp-nav",
        button_previous: "rdp-nav_button rdp-nav_button_previous",
        button_next: "rdp-nav_button rdp-nav_button_next",
        month_grid: "rdp-table",
        weekdays: "rdp-head_row",
        weekday: "rdp-head_cell",
        week: "rdp-row",
        day: "rdp-cell",
        day_button: "rdp-day",
        selected: "rdp-day_selected",
        today: "rdp-day_today",
        outside: "rdp-day_outside",
        disabled: "rdp-day_disabled",
        hidden: "rdp-day_hidden",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
