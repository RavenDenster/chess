import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./App.sass";
import { Context } from './context.js'
import Desktop from "./components/display/Desktop";
import Mobile from "./components/display/Mobile";
import { Board } from "./models/Board";
import { Colors } from "./models/Colors";
import { Player } from "./models/Player";
const App = () => {
  const [board, setBoard] = useState(new Board())
  const whitePlayer = new Player(Colors.WHITE)
  const blackPlayer = new Player(Colors.BLACK)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [blackTime, setBlackTime] = useState<number>(300)
  const [whiteTime, setWhiteTime] = useState<number>(300)

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  })
  const isTabletOrMobile = useMediaQuery({ 
    query: "(max-width: 1224px)"
  })
  useEffect(() => {
    restart()
  }, [])

  function swapPlayer() {
    setCurrentPlayer(
      currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer
    )
  }

  function restart() {
    const newBoard = new Board()
    newBoard.initCells()
    newBoard.addFigures()
    setBoard(newBoard)
    setCurrentPlayer(whitePlayer)
  }

  return (
    <Context.Provider value={{
      blackTime, setBlackTime, whiteTime, setWhiteTime  
    }}>
      <div className="app">
        {isDesktopOrLaptop && (
          <Desktop
            restart={restart}
            board={board}
            setBoard={setBoard}
            currentPlayer={currentPlayer}
            swapPlayer={swapPlayer}
          />
        )}
        {isTabletOrMobile && (
          <Mobile
            restart={restart}
            board={board}
            setBoard={setBoard}
            currentPlayer={currentPlayer}
            swapPlayer={swapPlayer}
          />
        )}
      </div>
    </Context.Provider>
  )
}

export default App;
