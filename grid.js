const GRID_SIZE = 5;
const CELL_SIZE = 15;
const CELL_GAP = 2;

function generateGridCells(gridContainer) {
    const cells = []
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        gridContainer.append(cell);
    }
    return cells;
}

class Cell {
    #cellElement;
    #x;
    #y;
    #tile;
    #mergeTile;
    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    get tile() {
        return this.#tile;
    }

    set tile(newTile) {
        this.#tile = newTile;
        if (newTile == null) return;
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value;
        if (value == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    canAccept(tile) {
        return (
            this.tile == null ||
            (this.mergeTile == null && this.tile.value === tile.value)
        );
    }
    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;
        this.tile.value = this.tile.value + this.mergeTile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
    }
}

export default class Grid {
    #cells;
    constructor(gridContainer) {
        gridContainer.style.setProperty("--grid-size", GRID_SIZE);
        gridContainer.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridContainer.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
        this.#cells = generateGridCells(gridContainer).map((cell, index) => {
            return new Cell(cell, index % GRID_SIZE, parseInt(index / GRID_SIZE));
        });
    }
    get cells() {
        return this.#cells
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;
        }, []);
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell;
            return cellGrid;
        }, []);
    }

    get #emptyCells() {
        return this.#cells.filter((cell) => cell.tile == null);
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex];
    }
}