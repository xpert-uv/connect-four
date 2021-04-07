
class Game {
    constructor(p1, p2, width = 7, height = 6) {
        this.players = [p1, p2];
        this.width = width;
        this.height = height;
        this.makeBoard();
        this.makeHtmlBoard();
        this.currPlayer = p1;
        this.gameover = false;

    }

    makeBoard() {
        this.board = [];
        for (let y = 0; y < this.height; y++) {
            (this.board).push(Array.from({ length: this.width }));
        }
    }
    makeHtmlBoard() {
        const htmlBoard = document.getElementById('board');

        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        this.handleClick = this.handleClick.bind(this);
        top.addEventListener('click', this.handleClick);

        for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        htmlBoard.append(top);

        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            htmlBoard.append(row);
        }
    }

    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.color;
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    handleClick(evt) {

        if (this.gameover) {
            return;
        }
        // get x from ID of clicked cell
        const x = +evt.target.id;

        // get next spot in column (if none, ignore click)
        let y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            this.gameover = true;
            return this.endGame(`Player ${this.currPlayer.color} won!`);
        }

        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
            return this.endGame('Tie!');
        }

        // switch players
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];

        const turnDisplay = document.querySelector(".turn");
        if (this.currPlayer === this.players[0]) {
            turnDisplay.innerHTML = "Player One's Turn"
        }
        if (this.currPlayer === this.players[1]) {
            turnDisplay.innerHTML = "Player Two's Turn"
        };

    }



    checkForWin() {

        const _win = cells =>
            cells.every(
                ([y, x]) =>
                    y >= 0 &&
                    y < this.height &&
                    x >= 0 &&
                    x < this.width &&
                    this.board[y][x] === this.currPlayer
            );

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
    /** placeInTable: update DOM to place piece into HTML table of board */





    endGame(msg) {
        alert(msg);
    }

}
class Player {
    constructor(color) {
        this.color = color;
    }
}

document.getElementById('start-game').addEventListener('click', () => {
    let p1 = new Player(document.getElementById('p1-color').value);
    let p2 = new Player(document.getElementById('p2-color').value);
    new Game(p1, p2);
});









