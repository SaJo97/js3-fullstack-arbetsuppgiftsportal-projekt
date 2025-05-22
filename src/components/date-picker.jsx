import { format, isToday, isTomorrow, isValid, isYesterday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { sv } from "date-fns/locale";
export const DatePicker = ({ date, onDateChange }) => {
  const handleDateSelect = (selectedDate) => {
    // Defensive check for undefined/null or invalid input
    if (
      !selectedDate ||
      !(selectedDate instanceof Date) ||
      !isValid(selectedDate)
    ) {
      console.warn(
        "DatePicker received invalid or undefined date:",
        selectedDate
      );
      return;
    }
    // Skip if selected date is same as current date
    if (date && selectedDate.getTime() === date.getTime()) {
      console.log(
        "Selected date is same as currently selected date; ignoring."
      );
      return;
    }
    // Call the onDateChange function with the new date
    onDateChange(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {isToday(date)
            ? "Idag"
            : isTomorrow(date)
            ? "Imorgon"
            : isYesterday(date)
            ? "Igår"
            : format(date, "PPP", { locale: sv })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
