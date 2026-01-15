"use client";

import { useEffect, useRef } from "react";

// ============================================================================
// CUSTOM CURSOR COMPONENT
// ============================================================================

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      isTouch.current = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    };
    checkTouch();

    // Don't initialize on touch devices
    if (isTouch.current) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Mouse move handler
    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    // Hover handlers
    const addHover = () => cursor.classList.add("hovered");
    const removeHover = () => cursor.classList.remove("hovered");

    // Add mouse move listener
    window.addEventListener("mousemove", moveCursor);

    // Add hover listeners to interactive elements
    const addHoverListeners = () => {
      const triggers = document.querySelectorAll(
        ".hover-trigger, a, button, input, select, textarea, [role='button']"
      );
      triggers.forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    };

    // Initial setup
    addHoverListeners();

    // Observe DOM changes to add listeners to new elements
    const observer = new MutationObserver(() => {
      addHoverListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id="cursor"
      ref={cursorRef}
      className="hidden md:block pointer-events-none"
      aria-hidden="true"
    />
  );
}
