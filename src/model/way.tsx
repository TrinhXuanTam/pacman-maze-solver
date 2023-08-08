import {GameObject} from "./game-object";
import {Position} from "./position";

export class Way implements GameObject {
    position: Position;

    constructor(position: Position) {
        this.position = position;
    }
}
