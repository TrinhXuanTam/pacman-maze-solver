import {Position} from "./position";

export class GameState {
    pacmanPosition: Position;

    remainingPellets: boolean[];

    constructor(pacmanPosition: Position, remainingPellets: boolean[]) {
        this.pacmanPosition = pacmanPosition;
        this.remainingPellets = remainingPellets;
    }

    toString(): string {
        return JSON.stringify([this.pacmanPosition.x, this.pacmanPosition.y, this.remainingPellets]);
    }
}
