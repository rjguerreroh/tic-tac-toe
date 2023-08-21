import { useState } from "react";
import confetti from "canvas-confetti";

const TURNS = {
  X: "×",
  O: "o",
};

// const board = Array(9).fill(null)

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`
  const handleClick = () => {
    updateBoard(index)
  }
  return (
    <div onClick={handleClick} className={className}>
      {children}      
    </div>
  )
}

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]


function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X)
  // null no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)
  const checkWinner = (newBoard) => {
    // Revisamos todas las combinaciones ganadoras
    for(const combo of WINNER_COMBOS){
      const [a, b, c] = combo;
      if(
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ){
        return newBoard[a]
      }
    }
    // Si no hay ganador
    return null;
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    if(board[index]) return
    const newBoard = [...board] // esto se hace por que la props y state no se mutan
    /**
     - Como practica los datos del renderizado siempre deben ser nuevos
     - No se puede modificar el valor de board directamente por quien se encarga de eso es el
       setBoard que viene del estado
     */
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // revisar si hay un gandor
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      //tener en cuenta que la actulizacion de los estados son asincronos, y no prodras ver en breve el valor cambiado
      // setWinner(newWinner)
      // alert(`El ganador es ${winner}`)
      // console.log(newWinner)
      // El anterior codigo no se puede ver el valor cambiado al instanta
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <>
      <main className="board">
        <h1>Tic Tac Toe</h1>
        <button onClick={resetGame}>Reset del Juego</button>
        <section className="game">
          {
            board.map((square, index) =>{
              return (
                <Square
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  {square}
                </Square>
              )
            })
          }
        </section>
        <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>
        {
          winner !== null && (
            <section className="winner">
              <div className="text">
                <h2>
                  {
                    winner === false
                      ? 'Empate'
                      : 'Gano:'
                  }
                </h2>
                <header className="win">
                  {winner && <Square>{winner}</Square>}
                </header>
                <footer>
                  <button onClick={resetGame}>Empezar de nuevo</button>
                </footer>
              </div>
            </section>
          )
        }
      </main>
    </>
  );
}

export default App;