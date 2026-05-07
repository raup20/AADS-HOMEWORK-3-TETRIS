# Bug Fixes and Small AI Tweaks

## 1. Correct Horizontal Move Bounds
The agent limited x-positions using an incorrect formula based on piece.type.size, which does not match the rotated piece width.
Fix: Updated the horizontal range so the agent attempts all legal placements.

## 2. Filtering Out Illegal Moves
Previously, invalid placements (overlaps, out-of-bounds) were still added to the move list.
Fix: Every candidate move is now checked with occupiedBoard() and only valid placements are evaluated.

## 3. Stable Hole Detection
Holes were previously miscounted when undefined/null values appeared in the board.
Fix: Hole detection now consistently treats non-occupied cells as empty, avoiding inflated hole scores.

## 4. Resetting Fall Timer After Speed Changes
Changing the fall speed (step) without resetting dt caused irregular piece drops.
Fix: dt is reset whenever step changes.

## 5. Safe Line Removal
removeLine() occasionally left null values at the top row, causing later errors.
Fix: The top row is now reset to 0, ensuring the board remains fully defined.

## 7. Loop Order Correction (heuristic_agent.js)
Loop order was incorrect which led to incorrect calculations of column heights.
Fix: Changed the order.

After this, these were the scores (check the First.png) average score of 44k, average rows cleared 595

---

# Further AI  tweaks (OTHER  THAN FIXING THE HEURISTIC AGENT BUGS)

## 8. Weight Adjustments
Changed the weights a little bit so we get better scores

## 9.
I noticed that the agent often tended to build a deep well — usually in the first or last column — and then 
relied heavily on receiving the 1×4 piece to fill that gap. When the piece did not arrive in time, the well 
would overflow and usually lead to a loss.
implemented a wall penalty to avoid such scenarios

after these changes, the results were as followed: average_score = 91654 average_rows = 720 (see Wellpenalty.png)
Although each run took a long time, limiting how much data I could collect, the pattern was clear:
the frequency of very low scores was reduced (less than 25k was rare), the agent became more consistent overall, 
the standard deviation dropped from ~70k to ~50k

---

# BEAMSEARCH ALGO 

Beam width was set to 5, and search depth to 2 (current + next piece). The agent uses the existing getPossibleMoves() function, 
ensuring only legal placements (correct rotations, drop positions, and no collisions) are considered. At depth 1, all legal placements 
for the current piece are evaluated and the top 5 are kept. Each of these is expanded using the next piece, and the best resulting child 
score determines the value of the first move.

---

# Results and Observations

Beam Search made the gameplay much smoother and more consistent.
The agent handled awkward piece sequences better, especially combinations involving `S`, `Z`, `J`, and `L` pieces.
It also avoided committing to extremely tall columns when the next piece would not fit well.
In my limited testing, Beam Search drastically improved the scores. The result screenshot is shown in `BEAMSEARCHPNG.png`.
One run was manually stopped because the agent continued for too long and did not seem close to losing. Because each run could take a long time, I was only able to test Beam Search on a small number of full attempts.
In the runs I tested, the Beam Search version reached scores above `3,000,000`.
More runs would be needed to calculate a reliable average, but the improvement compared to the previous heuristic-only agent was very clear.

---

# Summary

This project improved the Tetris AI agent in three main stages:

1. Fixed correctness bugs in move generation, hole detection, line removal, and board evaluation.
2. Improved the heuristic evaluation by adjusting weights and adding a wall/well penalty.
3. Added Beam Search so the agent could consider the next piece before choosing a move.

The final version is a search-based AI agent that uses legal move generation, heuristic board evaluation, and limited lookahead to make stronger decisions.

