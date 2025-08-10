import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./ui/command";
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type ComboboxItem = {
  value: string | number;
  label: string;
};

export function FormCombobox({
  value,
  onChange,
  items,
  loading,
  error,
}: {
  value: string;
  onChange: (_: string) => void;
  items: Array<ComboboxItem>;
  loading?: boolean;
  error?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  function renderComboboxLabel() {
    if (error) return "Something Went Wrong";
    if (loading) return "Loading...";
    if (value) return items.find((item) => String(item.value) === value)?.label;
    return "Select Value...";
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={loading || error}
        >
          {/* {loading
            ? "Loading..."
            : value
              ? items.find((item) => String(item.value) === value)?.label
              : "Select value ..."} */}
          {renderComboboxLabel()}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search items..." />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value.toString()}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === String(item.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
