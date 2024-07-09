## API

### init(fen?)

Init board with optional FEN string. If no FEN string is provided, the board is initialized with the standard chess starting position.

### moves()

Return all possible movements.

```
{
    'a1': ['a2', 'a3', 'a4', ...],
    'a2': ['a3', 'c3', ...],
    ...
    'h8': ['h7', 'h6', ...]
}
```

<!-- ### move(from, to, promotion='q') -->

Move a piece from one square to another. Returns true if the move was legal, otherwise false.

### board()

Return the board as a dictionary of squares and pieces. The keys are the squares and the values are the pieces. Empty squares are represented by the value None.

```
[
    'a1': 'R',
    'a2': 'P',
    'a3': None,
    ...
]
```

### isGameOver()

Returns true if the game has ended via checkmate or draw.

#### isCheckmate()

Returns true or false if the side to move has been checkmated.

#### isDraw()

Returns true or false if the game is drawn. Also include the reason for the draw. [bool, reason]

##### isStalemate()

Returns true or false if the side to move has been stalemated.

##### isFiftyMoveRule()

There has been no capture or pawn move in the last fifty moves by each player, if the last move was not a checkmate.

##### isInsuffcientMaterial()

Returns true if the game is drawn due to insufficient material:

- king against king
- king against king and bishop
- king against king and knight
- king and bishop against king and bishop, with both bishops on diagonals of the same color.

##### isThreefoldRepetition()

The same board position has occurred three times with the same player to move and all pieces having the same rights to move, including the right to castle or capture en passant.

##### isDeadPosition()

Returns true if it is possible to checkmate the opponent, otherwise false. (aka. canCheckmate())

> Too difficult to implement. Omit for now.

## Code example

```python
game = chess.init()
while not game.isGameOver():
    loadMoves(game.moves()) # load possible moves for UI
    await [from, to] # wait for user input
    game.move(from, to) # make movement
    updateState(game.board()) # update UI

if game.isCheckmate():
    print('Checkmate!')
    return

isDraw, reason = game.isDraw()
print(reason)
```
