import {
  forwardRef,
  useState,
  useMemo,
  useId,
  useRef,
  useEffect,
  type ReactNode,
  type ReactElement,
} from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/utils/cn";
import Button from "./Button";
import Input from "./Input";

/* ------------------ Types ------------------ */

export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

type SelectValue<T, Multiple extends boolean> = Multiple extends true
  ? T[]
  : T | undefined;

interface SelectProps<T, Multiple extends boolean = false> {
  options: SelectOption<T>[];
  value?: SelectValue<T, Multiple>;
  placeholder?: string;
  multiple?: Multiple;
  disabled?: boolean;
  label?: string;
  error?: string;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  name?: string;
  required?: boolean;
  description?: ReactNode;
  onChange?: (value: SelectValue<T, Multiple>) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/* ------------------ Component ------------------ */

function SelectInner<T, Multiple extends boolean = false>(
  {
    options,
    value,
    placeholder = "Select option",
    multiple,
    disabled,
    label,
    error,
    searchable,
    clearable,
    loading,
    description,
    name,
    required,
    onChange,
    onOpenChange,
    className,
  }: SelectProps<T, Multiple>,
  ref: React.Ref<HTMLButtonElement>
) {
  const id = useId(); // React-safe ID
  const containerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  /* ---------------- Outside Click ---------------- */

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onOpenChange]);

  /* ---------------- ESC Key Close ---------------- */

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onOpenChange]);

  /* ---------------- Derived Data ---------------- */

  const filteredOptions = useMemo(() => {
    if (!searchable || !search) return options;

    const term = search.toLowerCase();

    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        String(opt.value).toLowerCase().includes(term)
    );
  }, [options, search, searchable]);

  const isSelected = (val: T) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(val);
    }
    return value === val;
  };

  const selectedLabel = useMemo(() => {
    if (value === undefined) return placeholder;

    if (multiple) {
      const selected = options.filter((o) => (value as T[])?.includes(o.value));

      if (!selected.length) return placeholder;
      if (selected.length === 1) return selected[0].label;

      return `${selected.length} selected`;
    }

    return options.find((o) => o.value === value)?.label ?? placeholder;
  }, [value, options, multiple, placeholder]);

  const hasValue = multiple ? (value as T[])?.length > 0 : value !== undefined;

  /* ---------------- Handlers ---------------- */

  const toggle = () => {
    if (disabled) return;
    setIsOpen((p) => {
      onOpenChange?.(!p);
      return !p;
    });
  };

  const selectOption = (option: SelectOption<T>) => {
    if (option.disabled) return;

    if (multiple) {
      const arr = (value as T[]) ?? [];
      const newVal = arr.includes(option.value)
        ? arr.filter((v) => v !== option.value)
        : [...arr, option.value];

      onChange?.(newVal as SelectValue<T, Multiple>);
    } else {
      onChange?.(option.value as SelectValue<T, Multiple>);
      setIsOpen(false);
    }
  };

  const clearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.((multiple ? [] : undefined) as SelectValue<T, Multiple>);
  };

  /* ---------------- Render ---------------- */

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium mb-2 block">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={ref}
        id={id}
        type="button"
        disabled={disabled}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3 text-sm",
          error && "border-destructive",
          !hasValue && "text-muted-foreground"
        )}
      >
        <span className="truncate">{selectedLabel}</span>

        <div className="flex items-center gap-1">
          {clearable && hasValue && !loading && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearValue}
              className="h-4 w-4"
            >
              <X size={12} />
            </Button>
          )}

          <ChevronDown
            size={16}
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full rounded-md border bg-card shadow-md"
          role="listbox"
          id={`${id}-listbox`}
        >
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search size={16} className="absolute left-2 top-2.5" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                  placeholder="Search..."
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={String(option.value)}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-accent",
                    isSelected(option.value) &&
                      "bg-primary text-primary-foreground",
                    option.disabled && "opacity-50 pointer-events-none"
                  )}
                  role="option"
                  aria-selected={isSelected(option.value)}
                >
                  <span className="flex-1">{option.label}</span>

                  {multiple && isSelected(option.value) && <Check size={16} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {description && <p className="text-xs mt-1">{description}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}

      {/* Hidden native select */}
      <select
        name={name}
        value={
          multiple
            ? (value as T[] | undefined)?.map(String) ?? []
            : value !== undefined
            ? String(value)
            : ""
        }
        multiple={multiple}
        required={required}
        className="sr-only"
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------ Export ------------------ */

const ForwardedSelect = forwardRef(SelectInner);
ForwardedSelect.displayName = "Select";

export const Select = ForwardedSelect as unknown as <
  T,
  Multiple extends boolean = false
>(
  props: SelectProps<T, Multiple> & {
    ref?: React.Ref<HTMLButtonElement>;
  }
) => ReactElement;
