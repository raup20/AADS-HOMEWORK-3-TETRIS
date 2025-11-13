/* -----------------------------------------
   Beam Search Agent for Tetris
   Uses the same heuristic as heuristic_agent.js
   Depth = 1 or 2, Beam Width = configurable
------------------------------------------*/

// how many top moves to keep at depth 1
const BEAM_WIDTH = 5;

// 1 = simple greedy with better structure
// 2 = look one piece ahead
const BEAM_DEPTH = 2;

// evaluate a board using your existing heuristic
function scoreBoard(board) {
    return evaluateBoard(board);
}


function getScoredMoves(piece, board) {
    const moves = getPossibleMoves(piece, board);
    for (let m of moves) {
        m.score = scoreBoard(m.board);
    }
    return moves;
}


function beamSearchAgent(currentPiece, nextPiece, board) {
    let level1Moves = getScoredMoves(currentPiece, board);
    if (level1Moves.length === 0) return null;

    // sort by heuristic 
    level1Moves.sort((a, b) => b.score - a.score);
    let beam = level1Moves.slice(0, BEAM_WIDTH);

    if (BEAM_DEPTH === 1) {  //  if  depth is 1  
        return beam[0];
    }

    let globalBestMove = null;
    let globalBestScore = -Infinity;

    for (let m1 of beam) {
        const boardAfterFirst = m1.board;

        // generate all moves for the next piece 
        const virtualNextPiece = { type: nextPiece.type, dir: 0 };
        let secondLevelMoves = getScoredMoves(virtualNextPiece, boardAfterFirst);

        // if no moves available for next piece, just use first-level score
        if (secondLevelMoves.length === 0) {
            if (m1.score > globalBestScore) {
                globalBestScore = m1.score;
                globalBestMove = m1;
            }
            continue;
        }

        // choose the BEST child score 
        let bestChildScore = -Infinity;
        for (let m2 of secondLevelMoves) {
            if (m2.score > bestChildScore) {
                bestChildScore = m2.score;
            }
        }

        if (bestChildScore > globalBestScore) {
            globalBestScore = bestChildScore;
            globalBestMove = m1;
        }
    }

    return globalBestMove;
}


function beamAgent() {
    const move = beamSearchAgent(current, next, blocks);
    if (!move) return;

    current.x = move.x;
    current.y = move.y;
    current.dir = move.piece.dir;

    drop();  }