/**
 * go-send-bg Web Component
 *
 * Simple grid of white boxes on black background
 * with clustering to hide some boxes.
 *
 * Uses light DOM (no shadow DOM) for CSP compliance.
 * All styles are in styles.css.
 * SVG template is defined in templates/_background.gohtml
 */

class GoSendBackground extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupObservers();
  }

  setupObservers() {
    // Watch for window resize
    this.resizeHandler = () => {
      this.regenerateTiles();
    };
    window.addEventListener("resize", this.resizeHandler);

    // Watch for changes to elements we want to avoid
    this.resizeObserver = new ResizeObserver(() => {
      this.regenerateTiles();
    });

    // Observe section and footer
    const section = document.querySelector("go-send#app section");
    const footer = document.querySelector("footer");

    if (section) this.resizeObserver.observe(section);
    if (footer) this.resizeObserver.observe(footer);
  }

  render() {
    const template = document.getElementById("go-send-bg-template");

    if (!template) {
      console.error("Template go-send-bg-template not found");
      return;
    }

    // Clear existing content
    this.innerHTML = "";

    // Clone template content
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    // Generate tiles after appending
    this.generateTiles();
  }

  regenerateTiles() {
    // Debounce regeneration
    if (this.regenerateTimer) {
      clearTimeout(this.regenerateTimer);
    }

    this.regenerateTimer = setTimeout(() => {
      const tilesGroup = this.querySelector(".go-send-bg-tiles");
      if (tilesGroup) {
        // Clear existing tiles
        tilesGroup.innerHTML = "";
        // Regenerate
        this.generateTiles();
      }
    }, 100);
  }

  generateTiles() {
    const tilesGroup = this.querySelector(".go-send-bg-tiles");
    if (!tilesGroup) return;

    const viewBoxWidth = 1920;
    const viewBoxHeight = 1080;

    // Grid cell dimensions
    const cellWidth = 18;
    const cellHeight = 21;

    // Tile dimensions (smaller than cells to create spacing)
    const tileWidth = 11;
    const tileHeight = 14;

    // Calculate offset to center tiles in cells
    const offsetX = (cellWidth - tileWidth) / 2;
    const offsetY = (cellHeight - tileHeight) / 2;

    // Calculate grid dimensions
    const cols = Math.ceil(viewBoxWidth / cellWidth);
    const rows = Math.ceil(viewBoxHeight / cellHeight);

    // Generate cluster centers
    const clusterCenters = this.generateClusterCenters(cols, rows, 30);

    // Get exclusion zones (areas where tiles should not be drawn)
    const exclusionZones = this.getExclusionZones(viewBoxWidth, viewBoxHeight);

    console.log(`Generating ${cols}x${rows} grid (max ${cols * rows} tiles)`);
    console.log(`Exclusion zones:`, exclusionZones);

    // Create grid with gaps
    let tileCount = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Position tile centered in grid cell
        const x = col * cellWidth + offsetX;
        const y = row * cellHeight + offsetY;

        // Check if tile overlaps with any exclusion zone
        if (
          this.tileOverlapsExclusionZone(
            x,
            y,
            tileWidth,
            tileHeight,
            exclusionZones,
          )
        ) {
          continue;
        }

        // Determine if this tile should be hidden (clustering applies to ALL tiles)
        const shouldHide = this.shouldHideTile(col, row, clusterCenters);

        // Skip creating this tile if it should be hidden
        if (shouldHide) {
          continue;
        }

        const element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        element.setAttribute("x", x);
        element.setAttribute("y", y);
        element.setAttribute("width", tileWidth);
        element.setAttribute("height", tileHeight);
        element.setAttribute("rx", 1); // Slight rounding on corners
        element.classList.add("go-send-bg-tile");

        tilesGroup.appendChild(element);
        tileCount++;
      }
    }

    console.log(
      `Created ${tileCount} tiles (${((tileCount / (cols * rows)) * 100).toFixed(1)}% visible)`,
    );
  }

  /**
   * Get exclusion zones where tiles should not be drawn
   * Converts screen coordinates to SVG viewBox coordinates
   */
  getExclusionZones(viewBoxWidth, viewBoxHeight) {
    const zones = [];
    const svg = this.querySelector("svg");
    if (!svg) return zones;

    // Get the SVG's actual rendered dimensions on screen
    const svgRect = svg.getBoundingClientRect();
    if (svgRect.width === 0 || svgRect.height === 0) return zones;

    // Find elements to exclude
    const selectors = [
      "#app", // Main app section
      "footer", // Footer element
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (!element) continue;

      // Get element's actual position and size on screen
      const elemRect = element.getBoundingClientRect();

      // Convert screen pixel coordinates to SVG viewBox coordinates
      // using proper coordinate transformation
      const point = svg.createSVGPoint();

      // Top-left corner
      point.x = elemRect.left;
      point.y = elemRect.top;
      const topLeft = point.matrixTransform(svg.getScreenCTM().inverse());

      // Bottom-right corner
      point.x = elemRect.right;
      point.y = elemRect.bottom;
      const bottomRight = point.matrixTransform(svg.getScreenCTM().inverse());

      zones.push({
        selector,
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
        right: bottomRight.x,
        bottom: bottomRight.y,
      });
    }

    return zones;
  }

  /**
   * Check if a tile overlaps with any exclusion zone
   */
  tileOverlapsExclusionZone(
    tileX,
    tileY,
    tileWidth,
    tileHeight,
    exclusionZones,
  ) {
    const tileRight = tileX + tileWidth;
    const tileBottom = tileY + tileHeight;

    for (const zone of exclusionZones) {
      // Check for rectangle overlap
      const overlaps = !(
        tileRight <= zone.x || // tile is left of zone
        tileX >= zone.right || // tile is right of zone
        tileBottom <= zone.y || // tile is above zone
        tileY >= zone.bottom // tile is below zone
      );

      if (overlaps) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generate random cluster centers
   */
  generateClusterCenters(cols, rows, numClusters) {
    const centers = [];
    for (let i = 0; i < numClusters; i++) {
      centers.push({
        col: Math.random() * cols,
        row: Math.random() * rows,
        radius: 8 + Math.random() * 14, // Larger, more spread out clusters
      });
    }
    return centers;
  }

  /**
   * Determine if a tile should be hidden based on clustering
   * Tiles NEAR cluster centers are VISIBLE (not hidden)
   * Tiles FAR from cluster centers are HIDDEN
   */
  shouldHideTile(col, row, clusterCenters) {
    // Find distance to nearest cluster center
    let minDistance = Infinity;
    let nearestRadius = 0;

    for (const center of clusterCenters) {
      const dx = col - center.col;
      const dy = row - center.row;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        nearestRadius = center.radius;
      }
    }

    // Probability of being VISIBLE decreases with distance from cluster center
    // Tiles close to centers = high visibility = DON'T hide
    // Tiles far from centers = low visibility = DO hide
    // Lower exponent = more scattered, tiles visible further from centers
    const normalizedDistance = minDistance / nearestRadius;
    const visibilityProbability = Math.exp(-normalizedDistance * 1.5);

    // Invert: hide if NOT visible
    return Math.random() > visibilityProbability;
  }

  disconnectedCallback() {
    // Cleanup observers
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.regenerateTimer) {
      clearTimeout(this.regenerateTimer);
    }
  }
}

// Register the custom element
customElements.define("go-send-bg", GoSendBackground);

export default GoSendBackground;
