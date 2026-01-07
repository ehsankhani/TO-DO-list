import React, { useMemo, useRef, useState } from "react";

/**
 * Tiny fixed-row virtualization (windowing) for big lists.
 * Keeps dependencies lean (no react-window).
 */
export function VirtualList({
  items,
  itemHeight = 84,
  height = 560,
  overscan = 6,
  getKey,
  renderItem,
}) {
  const ref = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const viewportCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + viewportCount + overscan * 2);

  const slice = useMemo(() => items.slice(startIndex, endIndex), [endIndex, items, startIndex]);

  return (
    <div
      ref={ref}
      style={{ height, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {slice.map((item, i) => {
          const index = startIndex + i;
          const top = index * itemHeight;
          const key = getKey ? getKey(item) : index;
          return (
            <div key={key} style={{ position: "absolute", left: 0, right: 0, top }}>
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}


