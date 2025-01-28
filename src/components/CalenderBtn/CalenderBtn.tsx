import { FC } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "../ui/form";
import { Button } from "../ui/button";
import "../../style/global.css";
import { CalenderBtnProps } from "./CalenderBtnTypes";


const CalenderBtn: FC<CalenderBtnProps> = ({ field,disabled }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              " pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        side="top"
        align="start"
        style={{
          zIndex: 1500, // Set higher than any other UI element
        }}
      >
        <Calendar
          className="calendar bg-white text-black border-gray-300"
          mode="single"
          style={{zIndex:"1100"}}
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalenderBtn;
