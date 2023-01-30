import React, {FC, useEffect, useRef, useState, useContext} from 'react'
import { Colors } from '../models/Colors'
import { Player } from '../models/Player'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Context } from '../context'

interface TimeProps {
    currentPlayer: Player | null
    restart: () => void
}

const Timer: FC<TimeProps> = ({ currentPlayer, restart }) => {
    const [startTimes, setStartTimes] = useState(false)
    const timer = useRef<null | ReturnType<typeof setInterval>>(null)
    const {blackTime, setBlackTime, whiteTime, setWhiteTime} = useContext(Context)

    // For modal block
    const [show, setShow] = useState(true)
    const handleClose = () => setShow(false)

    useEffect(() => {
      startTime()
    }, [currentPlayer])

    function startTime() {
      if (startTimes){
        if (timer.current) {
          clearInterval(timer.current)
        }
        const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer
        timer.current = setInterval(callback, 1000) 
     } else {
        setStartTimes(false)
     }
    }

    function decrementBlackTimer() {
      
      setBlackTime((prev: number) => (prev > 0 ? prev - 1 : prev))
    }
    function decrementWhiteTimer() {
     
      setWhiteTime((prev: number)  => (prev > 0 ? prev - 1 : prev))
    }

    const handleStart = () => {
      setWhiteTime(300)
      setBlackTime(300)
      setStartTimes(true)
      restart()
    }

    const handleRestart = () => {
      setWhiteTime(300)
      setBlackTime(300)
      restart()
    }

    return (
      <div>
        {blackTime && whiteTime ? (
          <div className="timerBlock">
          <div className='timer-buttons'> 
            <button onClick={handleStart} className='bottom-game' disabled={startTimes}>Start game</button> 
            <button onClick={handleRestart} className='bottom-game'  disabled={!startTimes}>Restart game</button>  
          </div>
          <h2>Black`s time - {startTimes ? blackTime : 'click start'}</h2>
          <h2>White`s time - {startTimes ? whiteTime : 'click start'}</h2>
        </div>) : (
          <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          >
             <Modal.Header>
            <Modal.Title>Time is over</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Time's up! {whiteTime ? "White" : "Black"} wins! Congratulations!
            One more game?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleRestart}>
              New game
            </Button>
          </Modal.Footer>
          </Modal>
        )}
    </div>
  )
}

export default Timer