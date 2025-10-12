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
  }

  render() {
    const template = document.getElementById('go-send-bg-template');

    if (!template) {
      console.error('Template go-send-bg-template not found');
      return;
    }

    // Clear existing content
    this.innerHTML = '';

    // Clone template content
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    // Generate tiles after appending
    this.generateTiles();
  }

  generateTiles() {
    const tilesGroup = this.querySelector('.go-send-bg-tiles');
    if (!tilesGroup) return;

    const viewBoxWidth = 1920;
    const viewBoxHeight = 1080;

    // Grid cell dimensions
    const cellWidth = 12;
    const cellHeight = 15;

    // Tile dimensions (smaller than cells to create spacing)
    const tileWidth = 10;
    const tileHeight = 13;

    // Calculate offset to center tiles in cells
    const offsetX = (cellWidth - tileWidth) / 2;
    const offsetY = (cellHeight - tileHeight) / 2;

    // Calculate grid dimensions
    const cols = Math.ceil(viewBoxWidth / cellWidth);
    const rows = Math.ceil(viewBoxHeight / cellHeight);

    // Generate cluster centers
    const clusterCenters = this.generateClusterCenters(cols, rows, 25);

    console.log(`Generating ${cols}x${rows} grid (max ${cols * rows} tiles)`);

    // Create grid with gaps
    let tileCount = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Determine if this tile should be hidden (create gap)
        const shouldHide = this.shouldHideTile(col, row, clusterCenters);

        // Skip creating this tile if it should be hidden
        if (shouldHide) {
          continue;
        }

        // Position tile centered in grid cell
        const x = col * cellWidth + offsetX;
        const y = row * cellHeight + offsetY;

        const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        element.setAttribute('x', x);
        element.setAttribute('y', y);
        element.setAttribute('width', tileWidth);
        element.setAttribute('height', tileHeight);
        element.classList.add('go-send-bg-tile');

        tilesGroup.appendChild(element);
        tileCount++;
      }
    }

    console.log(`Created ${tileCount} tiles (${((tileCount / (cols * rows)) * 100).toFixed(1)}% visible)`);
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
        radius: 8 + Math.random() * 12
      });
    }
    return centers;
  }

  /**
   * Determine if a tile should be hidden based on clustering
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

    // Probability decreases with distance from cluster center
    const normalizedDistance = minDistance / nearestRadius;
    const probability = Math.exp(-normalizedDistance * 1.5);

    return Math.random() < probability;
  }

  disconnectedCallback() {
    // Cleanup if needed
  }
}

// Register the custom element
customElements.define('go-send-bg', GoSendBackground);

export default GoSendBackground;
