import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./Dropdown.scss";
type Prop<T, K1 extends keyof T, K2 extends keyof T> = {
  options: T[];
  labelKey: K1;
  valueKey: K2;
  selected?: T;
} & (T[K1] extends string ? object : never) &
  (T[K2] extends string ? object : never);

export default function Dropdown<T, K1 extends keyof T, K2 extends keyof T>({
  options,
  labelKey,
  valueKey,
  selected,
}: Prop<T, K1, K2>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internallySelected, setInternallySelected] = React.useState(selected);
  const handleOpenClose = () => {
    setIsOpen((prev) => !prev);
  };
  const handleOptionClick = (option: T) => {
    setInternallySelected(option);
    handleOpenClose();
  };
  return (
    <div className="dropdown-container">
      <div onClick={handleOpenClose} className="selected-container">
        <span>
          {internallySelected
            ? (internallySelected[labelKey] as string)
            : "Select"}
        </span>
        <span>
          {isOpen ? (
            <ChevronUp size="18px" strokeWidth={1} />
          ) : (
            <ChevronDown size="18px" strokeWidth={1} />
          )}
        </span>
      </div>
      {isOpen && (
        <div>
          {options.map((option) => {
            return (
              <div
                key={option[valueKey] as string}
                onClick={() => handleOptionClick(option)}
                className="option"
              >
                {option[labelKey] as string}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
