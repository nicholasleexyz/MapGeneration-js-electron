'use strict';

const seedrandom = require('seedrandom');

/**
 *
 */
function doTheThing() {
  let seed = 'asdf';

  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  let width = canvas.width = 512;
  let height = canvas.height = 512;

  const cellSize = 1;

  let grid = [];

  const seedInput = document.getElementById('seedInput');
  const ele = document.getElementsByName('size');

  for (let i = 0; i < ele.length; i++) {
    const element = ele[i];

    const change = () => {
      let s = 0;

      if (element.id === 'small') {
        s = 128;
      } else if (element.id === 'medium') {
        s = 256;
      } else if (element.id === 'large') {
        s = 512;
      }

      width = canvas.width = s;
      height = canvas.height = s;

      generateGrid();
    };

    element.onclick = change;
  }

  seedInput.addEventListener('input', () => {
    seed = seedInput.value;
    generateGrid();
  });

  /**
 *
 */
  function generateGrid() {
    grid = new Array(width).fill().map(() => new Array(height));

    grid = generateWanderingDrunkardNoise(seed, 1);

    for (let z = 1; z < 6; z++) {
      grid = generateCellularAutomata(grid);
    }

    grid = generateWanderingDrunkardNoise(seed, 10);

    drawGrid();
  }

  /**
   *
   * @param {Array.<Array.<number>>} noise
   * @return {Array.<Array.<number>>}
   */
  function generateCellularAutomata(noise) {
    const ca = new Array(width).fill().map(() => new Array(height));
    const currentNoise = noise.map((a) => a);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (y > 0 && y < height - 1 && x > 0 && x < width - 1) {
          const neighbors = [
            currentNoise[y + 1][x - 1],
            currentNoise[y + 1][x],
            currentNoise[y + 1][x + 1],
            currentNoise[y][x - 1],
            currentNoise[y][x + 1],
            currentNoise[y - 1][x - 1],
            currentNoise[y - 1][x],
            currentNoise[y - 1][x + 1],
          ];

          if (neighbors.filter((a) => a === 1).length > 3) {
            ca[y][x] = 1;
          } else {
            ca[y][x] = 0;
          }
        } else {
          ca[y][x] = 0;
        }
      }
    }

    return ca;
  }
  /**
 *
 * @param {string} seed
 * @param {number} numOfDrunkards
 * @return {Array.<Array.<number>>}
 */
  function generateWanderingDrunkardNoise(seed, numOfDrunkards) {
    const rng = seedrandom(seed);

    const noise = [];

    for (let y = 0; y < height; y++) {
      noise[y] = [];
      for (let x = 0; x < width; x++) {
        noise[y][x] = grid[y][x];
      }
    }

    let xCoord = Math.round(rng() * width) % width;
    let yCoord = Math.round(rng() * height) % height;

    for (let i = 0; i < numOfDrunkards; i++) {
      const steps = canvas.width * canvas.height / 4;
      noise[yCoord][xCoord] = 1;

      for (let j = 0; j < steps; j++) {
        const dir = Math.round(rng() * 4) % 4;

        for (let z = 0; z < 1; z++) {
          if (dir == 0) {
            noise[yCoord > height - 2 ? yCoord : ++yCoord][xCoord] = 1;
          } else if (dir == 1) {
            noise[yCoord][xCoord > height - 2 ? xCoord : ++xCoord] = 1;
          } else if (dir == 2) {
            noise[yCoord == 0 ? yCoord : --yCoord][xCoord] = 1;
          } else if (dir == 3) {
            noise[yCoord][xCoord == 0 ? xCoord : --xCoord] = 1;
          }
        }
      }
    }

    return noise;
  }

  generateGrid();

  /**
   *
  */
  function drawGrid() {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // context.fillStyle = grid[y][x] ? '#222E44' : '#3497A1';
        // context.fillStyle = grid[y][x] ? '#5B76B9' : '#63C7DD';
        context.fillStyle = grid[y][x] ? '#3A2B2A' : '#F5F6F7';
        // context.fillStyle = grid[y][x] ? '#000' : '#FFF';
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  const downloadButton = document.querySelector('#download-button');

  downloadButton.addEventListener('click', (e) => {
    const link = document.getElementById('link');

    link.setAttribute('download', `${seed}.png`);
    link.setAttribute('href',
        canvas.toDataURL('image/png')
            .replace('image/png', 'image/octet-stream'));

    link.click();
  });
}

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  doTheThing();
});
