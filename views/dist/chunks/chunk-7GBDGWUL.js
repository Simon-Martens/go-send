// src/tooltip.mjs
var currentOpenTooltip = null;
var closeDelayTimeoutId = null;
function tooltip(element, text, options = {}) {
  const position = options.position || "top";
  const isDefaultOpen = options.default === "open";
  const template = document.getElementById("_template_tooltip");
  if (!template) {
    console.warn("Tooltip template #_template_tooltip not found");
    return;
  }
  const tooltipEl = template.content.cloneNode(true).querySelector("[data-role='tooltip']");
  if (!tooltipEl) {
    console.warn("Tooltip template missing [data-role='tooltip']");
    return;
  }
  const contentEl = tooltipEl.querySelector("[data-role='tooltip-content']");
  if (contentEl) {
    contentEl.textContent = text;
  }
  const positionClasses = getPositionClasses(position);
  tooltipEl.className = `${tooltipEl.className} ${positionClasses}`;
  const pointerEl = tooltipEl.querySelector("[data-role='tooltip-pointer']");
  if (pointerEl) {
    const pointerClasses = getPointerClasses(position);
    pointerEl.className = pointerClasses;
  }
  document.body.appendChild(tooltipEl);
  if (isDefaultOpen) {
    requestAnimationFrame(() => {
      if (element.isConnected) {
        showTooltip(tooltipEl, element, position);
      }
    });
  }
  if (!isDefaultOpen) {
    let openTimeoutId = null;
    element.addEventListener("mouseenter", () => {
      if (closeDelayTimeoutId) {
        clearTimeout(closeDelayTimeoutId);
        closeDelayTimeoutId = null;
      }
      if (currentOpenTooltip && currentOpenTooltip !== tooltipEl) {
        hideTooltip(currentOpenTooltip);
        openTimeoutId = null;
        showTooltip(tooltipEl, element, position);
        currentOpenTooltip = tooltipEl;
      } else if (!currentOpenTooltip) {
        if (openTimeoutId) clearTimeout(openTimeoutId);
        openTimeoutId = setTimeout(() => {
          showTooltip(tooltipEl, element, position);
          currentOpenTooltip = tooltipEl;
          openTimeoutId = null;
        }, 80);
      }
    });
    element.addEventListener("mouseleave", () => {
      if (openTimeoutId) {
        clearTimeout(openTimeoutId);
        openTimeoutId = null;
      }
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
function showTooltip(tooltipEl, element, position) {
  tooltipEl.style.position = "absolute";
  tooltipEl.classList.remove("hidden");
  requestAnimationFrame(() => {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const offset = 8;
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
    tooltipEl.classList.remove("opacity-0");
    tooltipEl.classList.add("opacity-100");
  });
}
function hideTooltip(tooltipEl) {
  tooltipEl.classList.remove("visible", "opacity-100");
  tooltipEl.classList.add("hidden", "opacity-0");
}
function getPositionClasses(position) {
  return "absolute px-2 py-1 text-xs rounded-lg whitespace-nowrap shadow-lg z-[9999] transition-opacity duration-200";
}
function getPointerClasses(position) {
  const baseClasses = "absolute w-0 h-0";
  switch (position) {
    case "bottom":
      return `${baseClasses} -top-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-orange-700`;
    case "left":
      return `${baseClasses} -right-2 top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-orange-700`;
    case "right":
      return `${baseClasses} -left-2 top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-orange-700`;
    case "top":
    default:
      return `${baseClasses} -bottom-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-orange-700`;
  }
}

export {
  tooltip
};
//# sourceMappingURL=chunk-7GBDGWUL.js.map
