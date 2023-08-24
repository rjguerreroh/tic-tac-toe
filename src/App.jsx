import { useState } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square"
import { TURNS } from "./constans"
import { checkEndGame, checkWinner } from "./logic/board"
import { WinnerModal } from "./components/WinnerModal"
import { resetGameToStorage, saveGameToStorage } from "./logic/storage"

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('turn')
    return boardFromStorage ?? TURNS.X
  })
  // null no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetGameToStorage()
  }

  const updateBoard = (index) => {
    if(board[index] || winner) return
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
    //Guardar aqui partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

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
        <WinnerModal winner={winner} resetGame={resetGame}/>
      </main>
    </>
  );
}

export default App;