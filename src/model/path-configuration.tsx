import {Position} from "./position";
import {Pellet} from "./pellet";
import {GameState} from "./game-state";

export class PathConfiguration {
    path: Position[];

    state: GameState;

    heuristic: number;

    cost: number;

    totalCost: number;

    constructor(path: Position[], state: GameState, heuristic: number, cost: number) {
        this.path = Array.from(path);
        this.state = state;
        this.heuristic = heuristic;
        this.cost = cost;
        this.totalCost = heuristic + cost;
    }

    static comparator(a: PathConfiguration, b: PathConfiguration): number {
        return a.totalCost - b.totalCost;
    }
}
