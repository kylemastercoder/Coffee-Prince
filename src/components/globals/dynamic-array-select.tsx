"use client";

import { useTheme } from "next-themes";
import { useMemo, useCallback } from "react";
import { MultiValue } from "react-select";
import CreateableSelect from "react-select/creatable";
import { Button } from "../ui/button";

type Props = {
  onChange: (value?: string[]) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string[] | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const DynamicArraySelect = ({
  value = [],
  onChange,
  disabled,
  onCreate,
  options = [],
  placeholder,
}: Props) => {
  const onSelect = (options: MultiValue<{ label: string; value: string }>) => {
    onChange(options.map((option) => option.value));
  };

  const formattedValue = useMemo(() => {
    return options.filter((option) => value?.includes(option.value));
  }, [options, value]);

  const handleCreate = (inputValue: string) => {
    if (onCreate) {
      onCreate(inputValue);
    }
  };

  const selectAll = useCallback(() => {
    // Select all available options
    onChange(options.map((option) => option.value));
  }, [options, onChange]);

  const { theme } = useTheme();

  return (
    <div className="flex items-start gap-2">
      <CreateableSelect
        isMulti
        placeholder={placeholder}
        className="text-sm text-white dark:bg-neutral-950 bg-white w-full"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: theme === "dark" ? "#111" : "#e2e8f0",
            backgroundColor: theme === "dark" ? "bg-neutral-950" : "bg-white",
            ":hover": { borderColor: theme === "dark" ? "#111" : "#e2e8f0" },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff", // Set dropdown menu background color
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
              ? (theme === "dark" ? "#333" : "#ed8712") // Highlight color when focused
              : theme === "dark" ? "#1f1f1f" : "#ffffff", // Background color for options
            color: theme === "dark" ? "#ffffff" : "#000000", // Text color
          }),
        }}
        value={formattedValue}
        onChange={onSelect}
        options={options}
        onCreateOption={handleCreate}
        isDisabled={disabled}
      />
      <Button
        type="button"
        onClick={selectAll}
        disabled={disabled || options.length === 0}
        variant="secondary"
      >
        Select All
      </Button>
    </div>
  );
};
