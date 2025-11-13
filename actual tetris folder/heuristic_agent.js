// Heuristic evaluation function
function evaluateBoard(board) {
    let aggregateHeight = 0;
    let completeLines = 0;
    let holes = 0;
    let bumpiness = 0;
    let columnHeights = new Array(nx).fill(0);

    // Calculate aggregate height and column heights
    for (let x = 0; x < nx; x++) {
        for (let y = 0; y < ny; y++) {
            if (board[x][y] !== 0) {
                columnHeights[x] = ny - y;
                aggregateHeight += columnHeights[x];
                break;
            }
        }
    }

    // Calculate complete lines
    for (let y = 0; y < ny; y++) {
        var complete = true;
        for (let x = 0; x < nx; x++) {
            if (board[x][y] === 0) {
                complete = false;
                break;
            }
        }
        if (complete)
            completeLines++;
    }

    // Calculate holes
    for (let x = 0; x < nx; x++) {
        let blockFound = false;
        for (let y = 0; y < ny; y++) {
            if (board[x][y] !== 0) {
                blockFound = true;
            } else if (blockFound && (board[x][y] === 0 || board[x][y] == null) ){
                holes++;
            }
        }
    }

    // Calculate bumpiness
let Maxcolumnheight = 0;

for (let x = 0; x < nx - 1; x++) {
    if (Maxcolumnheight < columnHeights[x]) {
        Maxcolumnheight = columnHeights[x];
    }
    bumpiness += Math.abs(columnHeights[x] - columnHeights[x + 1]);
}

// well height 
let wellPenalty = 0;
for (let x = 0; x < nx; x++) {
    if (
        columnHeights[x] >= 8 &&
        (x === 0 || columnHeights[x] - columnHeights[x - 1] >= 4) &&
        (x === nx - 1 || columnHeights[x] - columnHeights[x + 1] >= 4)
    ) {
        wellPenalty += columnHeights[x];
    }
}

// Final score
return -0.51 * aggregateHeight
    + 0.76 * completeLines
    - 0.36 * holes
    - 0.18 * bumpiness
    - 3 * wellPenalty;
}

// Function to deep copy the blocks array
function copyBlocks(blocks) {
    let new_blocks = [];
    for (let x = 0; x < nx; x++) {
        new_blocks[x] = [];
        for (let y = 0; y < ny; y++) {
            new_blocks[x][y] = blocks[x][y];
        }
    }
    return new_blocks;
}

function getPieceWidth(type, dir) {
    let minX = 4, maxX = -1;
    eachblock(type, 0, 0, dir, function(x, y) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
    });
    return maxX - minX + 1;
}


// Generate all possible moves for the current piece
function getPossibleMoves(piece, board) {
    let moves = [];
    // For each rotation of the piece
    for (let dir = 0; dir < 4; dir++) {
        let testPiece = { 
            type: piece.type, 
            dir: dir 
        };
        // For each horizontal position
        let w = getPieceWidth(testPiece.type, testPiece.dir);
        for (let x = -2; x < nx; x++) {
             if (occupiedBoard(testPiece.type, x, 0, testPiece.dir, board)) {
        continue;
    }

            let y = getDropPosition(testPiece, x, board);
            let new_blocks = copyBlocks(board);
            eachblock(testPiece.type, x, y, testPiece.dir, function(px, py) {
    if (px >= 0 && px < nx && py >= 0 && py < ny) {
        new_blocks[px][py] = testPiece.type;
    }
});
    if (!occupiedBoard(testPiece.type, x, y, testPiece.dir, board)) {
            moves.push({
                piece: { 
                    type: testPiece.type, 
                    dir: testPiece.dir 
                },
                x: x,
                y: y,
                board: new_blocks
            });
        }
        }
    }
    return moves;
}
// Select the best move based on heuristic evaluation
function selectBestMove(piece, board) {
    let moves = getPossibleMoves(piece, board);
    let bestMove = null;
    let bestScore = -Infinity;
    moves.forEach(move => {
        let score = evaluateBoard(move.board);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    });
    return bestMove;
}

// Function to get the drop position of the piece
function getDropPosition(piece, x, board) {
    let y = 0;
    while (!occupiedBoard(piece.type, x, y + 1, piece.dir, board)) {
        y++;
    }
    return y;
}

function occupiedBoard(type, x, y, dir, board) {
    let result = false;

    eachblock(type, x, y, dir, function(px, py) {

        if (px < 0 || px >= nx || py < 0 || py >= ny) {
            result = true;
            return;
        }
        if (board[px][py] !== 0 && board[px][py] !== null) {
            result = true;
        }
    });

    return result;
}
