import { cloneElement } from "react";
import { useSortable } from "@dnd-kit/sortable";

export default function Sortable({ id, children }) {
  const { attributes, listeners, isDragging, index, activeIndex, over, setNodeRef } = useSortable({ id });

  return cloneElement(children, {
    ref: setNodeRef,
    "data-active": isDragging,
    "data-position":
      // eslint-disable-next-line no-nested-ternary
      activeIndex >= 0 && over?.id === id && !isDragging ? (index > activeIndex ? "after" : "before") : undefined,
    ...attributes,
    ...listeners,
  });
}
