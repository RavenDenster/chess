import React, { FC, useEffect, useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { FigureNames } from "../models/figures/Figure";
import { Player } from "../models/Player";
import CellComponents from "./CellComponents";
import { Context } from '../context'

interface BoardProps {
  restart: () => void;
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
}

const BoardComponent: FC<BoardProps> = ({ board, setBoard, currentPlayer, swapPlayer, restart }) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
  const {setWhiteTime, setBlackTime} = useContext(Context)

  // For modal block
  const [show, setShow] = useState(true)
  const handleClose = () => setShow(false)

    // function click(cell: Cell) {
   //   if(selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
   //     selectedCell.moveFigure(cell) // selectedCell это выбранная, а cell это текущая / в selectedCell всё ещё сохраняется перво кликнутая ячейка и относительно её работает метод moveFigure с cell (тоесть второ кликнутой ячейкой)
   //     board.pawnReady();
   //     swapPlayer()
   //     setSelectedCell(null)
   //     updateBoard()
   //   } else {
   //     if(cell.figure?.color === currentPlayer?.color) {
   //       setSelectedCell(cell) // при первом клике в состояние попадает текущая ячейка, а при втором клике в функцию попадает другая ячейка и она удавлитворяет условиям и у старой ячейки вызывается moveFigure с новой ячейкой 
   //     }
   //   }
   // }

  function click(cell: Cell) {
    if (selectedCell && selectedCell !== cell && cell.available) {
      selectedCell?.moveFigure(cell)
      board.pawnReady()
      swapPlayer()
      board.isCheckmate(currentPlayer?.color)
      setSelectedCell(null)
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell)
      }
      if (!cell.figure) {
        setSelectedCell(null)
      }
    }
  }

  useEffect(() => {
    highlightCells()
  }, [selectedCell]) // на любое изменение выбраной ячейки будем вызыватьметод

  function highlightCells() {
    board.highlightCells(selectedCell, currentPlayer?.color) // подсчитаваем на какие ячейки может перемещаться фигура на данный момент
    updateBoard()
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard()
    setBoard(newBoard)
  }

  const handleRestartMate = () => {
    board.checkmate = false
    setWhiteTime(300)
    setBlackTime(300)
    restart()
  }

  const handleRestartPromote = (type: FigureNames) => {
    if (board.promotePawnCell) {
      board.promotePawn(
        board.promotePawnCell?.figure?.color,
        board.promotePawnCell,
        type
      )
    }
    board.promotePawnCell = null;
    updateBoard()
  }

  return (
    <div className="Container">
      {board.checkmate || board.stalemate ? (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {board.checkmate ? "That`s mate!" : "That`s stalemate"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {board.checkmate
              ? ` ${
                  board.blackCheck ? "White" : "Black"
                } wins! Congratulations! One
            more game?`
              : "It`s a draw! One more game?"}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleRestartMate}>
              New game
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <></>
      )}
      {board.promotePawnCell ? (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>Choose the figure to promote your pawn!</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => handleRestartPromote(FigureNames.QUEEN)}
            >
              Queen
            </Button>
            <Button
              variant="primary"
              onClick={() => handleRestartPromote(FigureNames.KNIGHT)}
            >
              Knight
            </Button>
            <Button
              variant="primary"
              onClick={() => handleRestartPromote(FigureNames.BISHOP)}
            >
              Bishop
            </Button>
            <Button
              variant="primary"
              onClick={() => handleRestartPromote(FigureNames.ROOK)}
            >
              Rook
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <></>
      )}
      <h3>Current player {currentPlayer?.color}</h3>
      <div>
        {board.whiteCheck || board.blackCheck ? (
          <h3>It`s check! Protect the king</h3>
        ) : (
          <></>
        )}
      </div>
      <div className="board">
        {board.cells.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((cell) => (
              <CellComponents
                click={click}
                cell={cell}
                key={cell.id}
                selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y} // поскольку selectedCell может быть null нужно добавить опшинал оператор
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BoardComponent;
