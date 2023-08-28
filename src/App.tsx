import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Square({ value, onSquareClick }:any) {
    return (
        <button
            className="square"
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function calculateWinner(squares:any) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
function Board({ xIsNext, squares, onPlay }:any) {
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }
    function handleClick(i: any) {
        if (squares[i] || winner) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const index = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const rows = index.map((i) => {

        var cells = i.map((j) => {
            return (<Square key={j.toString()} value={squares[j]} onSquareClick={() => handleClick(j)} />);
        });
        return (
            <div key={i.toString()} className="board-row">
                {cells}
            </div>
        );
    });

    return (
        <>
            <div className="status">{status}</div>
            {rows}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [ascend, setAscend] = useState(false);
    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;
    const toggle = ascend ? "Ascending" : "Descending";

    function handlePlay(nextSquares:any) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove:any) {
        setCurrentMove(nextMove);
    }

    function onToggle() {
        setAscend(!ascend);
    }

    const moves = history.map((squares, move) => {
        if (ascend) {
            move = history.length - 1 - move; //Display descending
        }
        let description;
        if (move == currentMove) {
            return (
                <li key={move}>
                    You are at move #{currentMove}
                </li>
            );
        }
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <button onClick={onToggle}>{toggle}</button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}