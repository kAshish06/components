import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";

import "./Dropdown.scss";

type Prop<T, K1 extends keyof T, K2 extends keyof T> = {
  options: T[];
  labelKey: K1;
  valueKey: K2;
  selected?: T;
  placeholder?: string;
} & (T[K1] extends string ? object : never) &
  (T[K2] extends string ? object : never);

export default function Dropdown<T, K1 extends keyof T, K2 extends keyof T>({
  options,
  labelKey,
  valueKey,
  selected,
  placeholder = "Select",
}: Prop<T, K1, K2>) {
  const optionContainerRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [internallySelected, setInternallySelected] = React.useState(selected);
  const outsideClickHandler = () => {
    if (isOpen) setIsOpen(false);
  };
  useClickOutside(optionContainerRef, outsideClickHandler);
  const handleOpenClose = () => {
    setIsOpen((prev) => !prev);
  };
  const handleOptionClick = (option: T) => {
    setInternallySelected(option);
    handleOpenClose();
  };
  const handleKeyDown = (e: React.KeyboardEvent, option: T) => {
    switch (e.code) {
      case "Enter": {
        setInternallySelected(option);
        handleOpenClose();
        break;
      }
      case "Escape": {
        handleOpenClose();
        break;
      }
      default: {
        return;
      }
    }
  };
  return (
    <div className="dropdown-container" ref={optionContainerRef}>
      <button onClick={handleOpenClose} className="selected-container">
        <span>
          {internallySelected
            ? (internallySelected[labelKey] as string)
            : placeholder}
        </span>
        <span>
          {isOpen ? (
            <ChevronUp size="18px" strokeWidth={1} />
          ) : (
            <ChevronDown size="18px" strokeWidth={1} />
          )}
        </span>
      </button>
      {isOpen && (
        <ul className="option-container">
          {options.map((option) => {
            return (
              <li
                tabIndex={0}
                key={option[valueKey] as string}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => handleKeyDown(e, option)}
                className={`option ${
                  internallySelected &&
                  internallySelected[valueKey] === option[valueKey]
                    ? "selected"
                    : ""
                }`}
              >
                {option[labelKey] as string}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
