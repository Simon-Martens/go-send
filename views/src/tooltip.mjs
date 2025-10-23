/**
 * Tooltip System
 *
 * Simple tooltip helper that manages hover tooltips with smart delay logic.
 * Only one tooltip can be open at a time (excluding default-open tooltips).
 *
 * Usage:
 *   tooltip(element, "Your text here", { position: "top", default: "closed" })
 */

// Track the currently open tooltip (non-default tooltips only)
let currentOpenTooltip = null;
let closeDelayTimeoutId = null;

/**
 * Initialize a tooltip for an element
 * @param {HTMLElement} element - The element to attach the tooltip to
 * @param {string} text - The text to display in the tooltip
 * @param {Object} options - Configuration options
 * @param {string} options.position - "top", "left", "right", or "bottom" (default: "top")
 * @param {string} options.default - "open" or "closed" (default: "closed")
 */
export function tooltip(element, text, options = {}) {
  const position = options.position || "top";
  const isDefaultOpen = options.default === "open";

  // Get the tooltip template
  const template = document.getElementById("_template_tooltip");
  if (!template) {
    console.warn("Tooltip template #_template_tooltip not found");
    return;
  }

  // Clone the template
  const tooltipEl = template.content
    .cloneNode(true)
    .querySelector("[data-role='tooltip']");
  if (!tooltipEl) {
    console.warn("Tooltip template missing [data-role='tooltip']");
    return;
  }

  // Set the text content
  const contentEl = tooltipEl.querySelector("[data-role='tooltip-content']");
  if (contentEl) {
    contentEl.textContent = text;
  }

  // Set positioning classes based on position option
  const positionClasses = getPositionClasses(position);
  tooltipEl.className = `${tooltipEl.className} ${positionClasses}`;

  // Set pointer positioning based on position option
  const pointerEl = tooltipEl.querySelector("[data-role='tooltip-pointer']");
  if (pointerEl) {
    const pointerClasses = getPointerClasses(position);
    pointerEl.className = pointerClasses;
  }

  // Append tooltip to body to escape overflow clipping, but position relative to element
  document.body.appendChild(tooltipEl);

  // If default-open, show it immediately (after a frame to ensure element is rendered)
  if (isDefaultOpen) {
    requestAnimationFrame(() => {
      if (element.isConnected) {
        showTooltip(tooltipEl, element, position);
      }
    });
  }

  // Setup hover handlers (only for closed tooltips)
  if (!isDefaultOpen) {
    let openTimeoutId = null;

    element.addEventListener("mouseenter", () => {
      // Clear any pending close
      if (closeDelayTimeoutId) {
        clearTimeout(closeDelayTimeoutId);
        closeDelayTimeoutId = null;
      }

      // If another tooltip is open, open this one instantly and close the old one
      if (currentOpenTooltip && currentOpenTooltip !== tooltipEl) {
        hideTooltip(currentOpenTooltip);
        openTimeoutId = null; // Clear any pending open since we're opening now
        showTooltip(tooltipEl, element, position);
        currentOpenTooltip = tooltipEl;
      } else if (!currentOpenTooltip) {
        // No tooltip open, schedule with 80ms delay
        if (openTimeoutId) clearTimeout(openTimeoutId);
        openTimeoutId = setTimeout(() => {
          showTooltip(tooltipEl, element, position);
          currentOpenTooltip = tooltipEl;
          openTimeoutId = null;
        }, 80);
      }
    });

    element.addEventListener("mouseleave", () => {
      // Clear any pending open
      if (openTimeoutId) {
        clearTimeout(openTimeoutId);
        openTimeoutId = null;
      }

      // Schedule close with 300ms delay
      if (closeDelayTimeoutId) clearTimeout(closeDelayTimeoutId);
      closeDelayTimeoutId = setTimeout(() => {
        if (currentOpenTooltip === tooltipEl) {
          hideTooltip(tooltipEl);
          currentOpenTooltip = null;
        }
        closeDelayTimeoutId = null;
      }, 300);
    });
  }
}

/**
 * Show a tooltip element with smooth fade-in
 * Calculates position based on element bounds
 */
function showTooltip(tooltipEl, element, position) {
  // Use absolute positioning (relative to body which is positioned relative)
  tooltipEl.style.position = "absolute";

  // Show first to get dimensions
  tooltipEl.classList.remove("hidden");

  // Use requestAnimationFrame to ensure element is rendered before measuring
  requestAnimationFrame(() => {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const offset = 8; // 8px gap from element

    // Account for page scroll
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    let top, left;

    switch (position) {
      case "bottom":
        top = rect.bottom + offset + scrollTop;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2 + scrollLeft;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2 + scrollTop;
        left = rect.left - tooltipRect.width - offset + scrollLeft;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2 + scrollTop;
        left = rect.right + offset + scrollLeft;
        break;
      case "top":
      default:
        top = rect.top - tooltipRect.height - offset + scrollTop;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2 + scrollLeft;
    }

    tooltipEl.style.top = top + "px";
    tooltipEl.style.left = left + "px";

    // Apply fade-in after positioning
    tooltipEl.classList.remove("opacity-0");
    tooltipEl.classList.add("opacity-100");
  });
}

/**
 * Hide a tooltip element with smooth fade-out
 */
function hideTooltip(tooltipEl) {
  tooltipEl.classList.remove("visible", "opacity-100");
  tooltipEl.classList.add("hidden", "opacity-0");
}

/**
 * Get position classes based on position option
 * (Position is calculated via JavaScript)
 */
function getPositionClasses(position) {
  return "absolute px-2 py-1 text-xs rounded-lg whitespace-nowrap shadow-lg z-[9999] transition-opacity duration-200";
}

/**
 * Get pointer positioning classes based on position option
 * (Pointer is positioned at the edge of the tooltip)
 */
function getPointerClasses(position) {
  const baseClasses = "absolute w-0 h-0";

  switch (position) {
    case "bottom":
      // Tooltip below element, pointer points up (at top of tooltip)
      return `${baseClasses} -top-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-orange-700`;
    case "left":
      // Tooltip left of element, pointer points right (at right of tooltip)
      return `${baseClasses} -right-2 top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-orange-700`;
    case "right":
      // Tooltip right of element, pointer points left (at left of tooltip)
      return `${baseClasses} -left-2 top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-orange-700`;
    case "top":
    default:
      // Tooltip above element, pointer points down (at bottom of tooltip)
      return `${baseClasses} -bottom-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-orange-700`;
  }
}
