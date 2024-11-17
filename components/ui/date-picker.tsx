import * as React from "react";
import { getYear, setMonth, setYear, getMonth, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
interface DatePickerProps {
    value?: Date; // Valor controlado externamente
    onChange?: (date: Date) => void; // Função para atualizar o valor
    ref?: React.Ref<HTMLDivElement>; // Suporte para referência (opcional)
    startYear?: number; // Ano inicial para seleção
    endYear?: number; // Ano final para seleção
  }
  
  export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
    ({ value, onChange, startYear, endYear }, ref) => {
      const [internalDate, setInternalDate] = React.useState<Date | undefined>(value);
  
      React.useEffect(() => {
        if (value) {
          setInternalDate(value);
        }
      }, [value]);
  
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
  
      const years = Array.from(
        { length: (endYear || getYear(new Date()) + 100) - (startYear || getYear(new Date()) - 100) + 1 },
        (_, i) => (startYear || getYear(new Date()) - 100) + i
      );
  
      const handleMonthChange = (month: string) => {
        const newDate = setMonth(internalDate || new Date(), months.indexOf(month));
        setInternalDate(newDate);
        onChange?.(newDate);
      };
  
      const handleYearChange = (year: string) => {
        const newDate = setYear(internalDate || new Date(), parseInt(year, 10));
        setInternalDate(newDate);
        onChange?.(newDate);
      };
  
      const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
          setInternalDate(selectedDate);
          onChange?.(selectedDate);
        }
      };
  
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[250px] justify-start text-left font-normal",
                !internalDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {internalDate ? format(internalDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="flex justify-between p-2">
              <Select
                onValueChange={handleMonthChange}
                value={months[getMonth(internalDate || new Date())]}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={handleYearChange}
                value={(internalDate ? getYear(internalDate) : getYear(new Date())).toString()}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
  
            <Calendar
              mode="single"
              selected={internalDate}
              onSelect={handleSelect}
              initialFocus
              month={internalDate || new Date()}
              onMonthChange={setInternalDate}
            />
          </PopoverContent>
        </Popover>
      );
    }
  );
  
  DatePicker.displayName = "DatePicker";