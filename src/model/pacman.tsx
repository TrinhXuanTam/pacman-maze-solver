import {GameObject} from "./game-object";
import {Position} from "./position";

export class Pacman implements GameObject {
    position: Position;

    constructor(position: Position) {
        this.position = position;
    }
}
