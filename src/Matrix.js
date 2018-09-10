import React from "react";
import Cell from "./Cell";

class Matrix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matrix: this.generateMatrix()
    };
  }

  generateMatrix() {
    let rows = 50;
    let columns = 50;
    let matrix = [];
    let counter = 0;
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push({ id: counter++, alive: false });
      }
      matrix.push(row);
    }
    return matrix;
  }

  componentDidMount() {
    this.interval = setInterval(() => this.lifeMiracle(), 1000);
  }

  cellReact(cellId) {
    this.setState({
      matrix: this.state.matrix.map(row =>
        row.map(
          cell => (cell.id === cellId ? { ...cell, alive: !cell.alive } : cell)
        )
      )
    });
  }

  generateIndexes(x, y, matrix) {
    // function to generate a matrix to indentify what indexes can be verified
    var indexes = [];
    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          (i < matrix.length && j < matrix.length) &&
          (i !== x || j !== y)
        ) {
          indexes.push({ x: i, y: j });
        }
      }
    }
    return indexes;
  }

  countNeighborsAlive(x, y, matrix) {
    let neighborsCounter = 0;
    this.generateIndexes(x, y, matrix).map(neighbor => {
      matrix[neighbor.x][neighbor.y].alive && neighborsCounter++;
    });
    return neighborsCounter;
  }

  lifeMiracle() {
    let matrixCopy = this.state.matrix.slice();
    let row = [];
    let neighbors = 0;
    for (let i = 0; i < matrixCopy.length; i++) {
      row = matrixCopy[i];
      for (let j = 0; j < row.length; j++) {
        neighbors = this.countNeighborsAlive(i, j, matrixCopy);
        console.log(neighbors);
        if (neighbors < 2 || neighbors > 3) {
          matrixCopy[i][j].alive = false;
        } else if (neighbors === 3) {
          matrixCopy[i][j].alive = true;
        }
      }
    }
    this.setState({ matrix: matrixCopy });
  }

  render() {
    var i = 0;
    return this.state.matrix.map(row => (
      <div key={i++} style={{ display: "block", fontSize: "0" }}>
        {row.map(cell => (
          <Cell
            key={cell.id}
            alive={cell.alive}
            onClick={() => {
              clearInterval(this.interval);
              this.cellReact(cell.id);
              setTimeout(() => {
                this.interval = setInterval(this.lifeMiracle(), 1000);
              }, 3000);
            }}
          />
        ))}
      </div>
    ));
  }
}

export default Matrix;
