import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		for(let i = 0; i < 3; i++){
			for (let n = 0; n < 3; n++) {

			}
		}
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				lastMove: null,
			}],
			xIsNext: true,
			winner: null,
			stepNumber: 0,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const winner = calculateWinner(squares);
		if (winner || squares[i]) {
			this.setState({ winner: winner });
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: [
				...history,
				{ squares: squares },
			],
			xIsNext: !this.state.xIsNext,
			winner: winner,
			stepNumber: history.length
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
			history: this.state.history.slice(0, step + 1),
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		let status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

		if (winner) {
			status = `Game Over! Winner is: ${winner}`;
		}
		let difference;
		const moves = history.map((step, move) => {
			if (history.length > 1) {
				difference = history[move].squares.findIndex((value, index, obj) => {
					if (value === null)
						return false;
					else
						return history[move - 1].squares[index] !== value;
				}, history);

			}
			let row = difference < 3 ? 1 : difference < 6 ? 2 : 3;
			let col = row === 1 ? difference + 1 : row === 2 ? difference - 2 : difference - 5;
			const desc = move ? `${current.squares[difference]} at (${col}, ${row})` : 'Go to game start';

			const value = (move === this.state.stepNumber ? desc.bold() : desc);
			if (move === this.state.stepNumber)
				return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
					</li>
				);
			else
				return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}>{value}</button>
					</li>
				);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} winner={winner} onClick={(i) => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
			return squares[a];
	}
	return null;
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
