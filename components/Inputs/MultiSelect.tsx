import { useState, Dispatch, SetStateAction, useEffect, useRef } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "@/utils/classNames";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  required?: boolean;
};

export default function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  required,
}: Props) {
  const [filter, setFilter] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectChange = (selectedOptions: Option | Option[]) => {
    const newSelectedValues = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : selectedValues.includes(selectedOptions.value)
      ? selectedValues.filter((value) => value !== selectedOptions.value)
      : [...selectedValues, selectedOptions.value];
    onChange(newSelectedValues);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    if (!isOpen) setIsOpen(true); // Open the Listbox when the user starts typing
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="block text-sm font-medium leading-6 text-gray-900">
        {label}
        {required && <span className="text-red-500">*</span>}
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={filter}
        onChange={handleInputChange}
        className="w-full p-2 mb-2 border border-gray-300 rounded-md"
        onFocus={() => setIsOpen(true)} // Open the Listbox when the input is focused
      />
      <Listbox
        value={filteredOptions.filter((option) =>
          selectedValues.includes(option.value)
        )}
        onChange={handleSelectChange}
        multiple
      >
        {({ open }) => (
          <div className="relative">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6">
              <span className="block truncate text-base font-normal">
                {selectedValues.length > 0
                  ? selectedValues.map((value) => options.find(option => option.value === value)?.label).join(", ")
                  : "Select options"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>
            {isOpen && (
              <ListboxOptions
                transition
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {filteredOptions.map((option) => (
                  <ListboxOption
                    key={option.value}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-emerald-600 text-white" : "",
                        !active ? "text-gray-900" : "",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option.label}
                        </span>
                        {selected && (
                          <span
                            className={classNames(
                              selected ? "text-white" : "text-emerald-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            )}
          </div>
        )}
      </Listbox>
    </div>
  );
}