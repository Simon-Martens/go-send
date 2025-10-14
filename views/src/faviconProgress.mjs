/**
 * Favicon Progress Indicator
 *
 * Draws a circular progress ring on the favicon during upload/download.
 * Based on Firefox Send's implementation.
 */

const SIZE = 32;
const LOADER_WIDTH = 5;

/**
 * Draw a circular arc on canvas
 */
function drawCircle(canvas, context, color, lineWidth, outerWidth, percent) {
  canvas.width = canvas.height = outerWidth;
  context.translate(outerWidth * 0.5, outerWidth * 0.5);
  context.rotate(-Math.PI * 0.5);
  const radius = (outerWidth - lineWidth) * 0.5;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
  context.strokeStyle = color;
  context.lineCap = 'square';
  context.lineWidth = lineWidth;
  context.stroke();
}

/**
 * Generate a data URL for a favicon with progress indicator
 */
function drawProgressFavicon(progressRatio, primaryColor) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Draw background circle (light gray)
  drawCircle(canvas, context, '#efefef', LOADER_WIDTH, SIZE, 1);

  // Draw progress circle (primary color)
  drawCircle(canvas, context, primaryColor, LOADER_WIDTH, SIZE, progressRatio);

  return canvas.toDataURL();
}

/**
 * Update the favicon with progress indicator
 *
 * @param {number} progressRatio - Progress from 0.0 to 1.0
 */
export function updateFavicon(progressRatio) {
  let link = document.querySelector("link[rel='icon'][sizes='32x32']");

  // Create the icon link if it doesn't exist
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.sizes = '32x32';
    document.head.appendChild(link);
  }

  const progress = progressRatio * 100;

  // Reset to default favicon at 0% or 100%
  if (progress === 0 || progress === 100) {
    link.type = 'image/png';

    // Use custom favicon if configured, otherwise use default
    const customFavicon = window.WEB_UI?.CUSTOM_ASSETS?.favicon_32px;
    link.href = customFavicon || '/favicon-32x32.png';
    return;
  }

  // Draw progress indicator
  const primaryColor = window.WEB_UI?.COLORS?.PRIMARY || '#0A84FF';
  link.href = drawProgressFavicon(progressRatio, primaryColor);
}

/**
 * Update page title with progress percentage
 * (shown when tab is not focused)
 *
 * @param {number} progressRatio - Progress from 0.0 to 1.0
 */
export function updateTitle(progressRatio) {
  const percent = Math.floor(progressRatio * 100);
  document.title = `${percent}% - Send`;
}

/**
 * Reset page title to default
 */
export function resetTitle() {
  document.title = 'Send';
}

/**
 * Setup automatic favicon/title updates based on window focus
 * Call this once during app initialization
 */
export function setupProgressIndicators() {
  let updateTitleOnProgress = false;

  // When window loses focus, show progress in title
  window.addEventListener('blur', () => {
    updateTitleOnProgress = true;
  });

  // When window gains focus, reset to default
  window.addEventListener('focus', () => {
    updateTitleOnProgress = false;
    resetTitle();
    updateFavicon(0);
  });

  // Return helper to conditionally update title
  return {
    update: (progressRatio) => {
      if (updateTitleOnProgress) {
        updateTitle(progressRatio);
      }
      updateFavicon(progressRatio);
    },
    reset: () => {
      resetTitle();
      updateFavicon(0);
    }
  };
}
