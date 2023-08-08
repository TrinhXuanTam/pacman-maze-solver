import {Map} from "../../../model/map"
import React, {useEffect, useRef} from "react";
import {Wall} from "../../../model/wall";
import {Pellet} from "../../../model/pellet";
import {useWindowDimensions} from "../../../helpers/viewport-size";
import {Pacman} from "../../../model/pacman";
import {Link} from "react-router-dom";
import {Position} from "../../../model/position";
import {sleep} from "../../../helpers/sleep";

export function GameMap(props: { map: Map, path: Position[], initialPosition: Position }) {
    const map = props.map;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isPathFindingRunning = useRef(false);
    const {width} = useWindowDimensions();
    const blockSize = width * 0.01 > 20 ? width * 0.01 : 20;
    const pelletSize = blockSize * 0.15;
    const pacmanSize = blockSize * 0.4;

    const drawMap = function (): void {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < map.height; i++) {
            for (let j = 0; j < map.width; j++) {
                const gameObject = map.data[i][j]

                if (gameObject instanceof Pacman) {
                    const x = j * blockSize + blockSize * 0.5;
                    const y = i * blockSize + blockSize * 0.5;
                    context.fillStyle = 'yellow';
                    context.beginPath();
                    context.arc(x, y, pacmanSize, 0, 2 * Math.PI, false);
                    context.fill();
                }

                if (gameObject instanceof Wall) {
                    context.fillStyle = 'blue';
                    context.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
                }

                if (gameObject instanceof Pellet) {
                    const x = j * blockSize + blockSize * 0.5;
                    const y = i * blockSize + blockSize * 0.5;
                    context.fillStyle = 'white';
                    context.beginPath();
                    context.arc(x, y, pelletSize, 0, 2 * Math.PI, false);
                    context.fill();
                }
            }
        }
    }

    const resetMap = function () {
        isPathFindingRunning.current = false;
        drawMap();
    }

    const startPathFinding = async function (): Promise<void> {
        resetMap();
        await sleep(500);
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        let currentPosition = props.initialPosition;
        const path = Array.from(props.path);

        isPathFindingRunning.current = true;
        while (isPathFindingRunning.current && path.length) {
            const front = path.shift()!;

            context.fillStyle = 'black';
            context.fillRect(currentPosition.x * blockSize, currentPosition.y * blockSize, blockSize, blockSize);

            currentPosition = front;

            const x = front.x * blockSize + blockSize * 0.5;
            const y = front.y * blockSize + blockSize * 0.5;
            context.fillStyle = 'yellow';
            context.beginPath();
            context.arc(x, y, pacmanSize, 0, 2 * Math.PI, false);
            context.fill();
            await sleep(300);
        }
    }

    useEffect(drawMap, []);

    return <div>
        <header id='game-header'>
            <Link to='/' className={'back-button'}>&lt; back</Link>
            <div>{map.name}</div>
        </header>
        <canvas
            className='game-canvas'
            ref={canvasRef}
            height={blockSize * map.height}
            width={blockSize * map.width}
        />
        <footer id='game-footer'>
            <div className='action-text' onClick={resetMap}>reset</div>
            <div className='action-text' onClick={startPathFinding}>start</div>
        </footer>
    </div>;
}
