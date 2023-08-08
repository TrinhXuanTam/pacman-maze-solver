import {GameObject} from "./game-object";
import {Map as GameMap} from "./map"
import {Wall} from "./wall";
import {Pellet} from "./pellet";
import {Position} from "./position";
import {Pacman} from "./pacman";
import TinyQueue from "tinyqueue";
import {PathConfiguration} from "./path-configuration";
import {GameState} from "./game-state";

export class PacmanSearch {
    gameMap: GameMap;
    pellets: Pellet[];
    pelletIndices: Map<any, number>;
    pelletDistances: number[][];
    startPosition!: Position;

    constructor(gameMap: GameMap) {
        this.gameMap = gameMap;
        this.pellets = [];
        this.pelletDistances = [];
        this.pelletIndices = new Map();

        for (let i = 0; i < this.gameMap.height; i++) {
            for (let j = 0; j < this.gameMap.width; j++) {
                if (this.gameMap.data[i][j] instanceof Pellet) {
                    const pellet = this.gameMap.data[i][j];
                    this.pellets.push(pellet);
                    this.pelletIndices.set(pellet, this.pelletIndices.size);
                }
                if (this.gameMap.data[i][j] instanceof Pacman) {
                    this.startPosition = this.gameMap.data[i][j].position;
                }
            }
        }

        const pelletCnt = this.pelletIndices.size;
        this.pelletDistances = Array.from(Array(pelletCnt), () => new Array(pelletCnt))
    }

    async init(): Promise<void> {
        const pellets: Pellet[] = Array.from(this.pelletIndices.keys());
        for (let i = 0; i < pellets.length; i++) {
            for (let j = 0; j < pellets.length; j++) {
                const from = pellets[i];
                const to = pellets[j];
                this.pelletDistances[i][j] = this.getDistance(from.position, to.position);
            }
        }
    }

    findOptimalPath(): Position[] {
        const priorityQueue = new TinyQueue<PathConfiguration>([], PathConfiguration.comparator);
        const visited: Set<string> = new Set<string>();
        let path: Position[] = [];

        priorityQueue.push(new PathConfiguration(
            [this.startPosition],
            new GameState(this.startPosition, Array(this.pellets.length).fill(true)),
            0,
            0,
        ));

        while (priorityQueue.length) {
            const front = priorityQueue.pop()!;
            const state = front.state;
            path = front.path;

            if (front.state.remainingPellets.every(p => !p)) {
                return path;
            }

            if (!visited.has(front.state.toString())) {
                visited.add(front.state.toString());
            }

            for (const neighbor of this.getNeighboursStates(state)) {
                if (!visited.has(neighbor.toString())) {
                    const newPosition = neighbor.pacmanPosition;
                    const newPath = [...path, newPosition];
                    const newState = new GameState(newPosition, neighbor.remainingPellets);

                    const cost = this.cost(newPath);
                    const heuristic = this.heuristic(newPosition, newState.remainingPellets);
                    priorityQueue.push(new PathConfiguration(newPath, newState, heuristic, cost));
                }
            }
        }

        return path;
    }

    cost(path: Position[]): number {
        return path.length - 1;
    }

    heuristic(currentPosition: Position, remainingPellets: boolean[]) {
        const remainingPelletsCnt: number = remainingPellets.filter(p => p).length;
        let furthestPellets: Pellet[] = []
        let furthestDistance: number = 0;

        if (remainingPelletsCnt === 0) {
            return 0;
        }

        if (remainingPelletsCnt === 1) {
            const index = remainingPellets.indexOf(true);
            return this.getDistance(currentPosition, this.pellets[index].position);
        }

        for (let i = 0; i < this.pellets.length; i++) {
            if (!remainingPellets[i]) {
                continue;
            }

            for (let j = 0; j < this.pellets.length; j++) {
                if (!remainingPellets[j]) {
                    continue;
                }
                const distance = this.pelletDistances[i][j];
                if (distance > furthestDistance) {
                    furthestDistance = distance;
                    furthestPellets = [this.pellets[i], this.pellets[j]]
                }
            }
        }

        return furthestDistance + Math.min(...furthestPellets.map(p => this.getDistance(currentPosition, p.position)));
    }

    getPath(start: Position, destination: Position): Position[] {
        if (start.equals(destination)) {
            return [];
        }

        const startObj: GameObject = this.gameMap.data[start.y][start.x];
        const destinationObj: GameObject = this.gameMap.data[destination.y][destination.x];
        const visited: GameObject[] = [];
        const toVisit: GameObject[] = [startObj];
        const predecessors: Map<any, GameObject> = new Map();

        while (toVisit.length) {
            const first = toVisit.shift()!;

            if (first === destinationObj) {
                break;
            }

            for (const neighbor of this.getNeighbours(first)) {
                if (!(neighbor instanceof Wall) && !visited.includes(neighbor)) {
                    toVisit.push(neighbor);
                    visited.push(neighbor);
                    predecessors.set(neighbor, first);
                }
            }
        }

        if (!predecessors.has(destinationObj)) {
            throw new Error("Path not found!");
        }

        const path: Position[] = [destinationObj.position];
        let current: GameObject | undefined = destinationObj;
        while (current !== startObj) {
            current = predecessors.get(current)!;
            path.push(current.position);
        }

        return path.reverse();
    }

    getDistance(start: Position, destination: Position): number {
        return this.getPath(start, destination).length;
    }

    getNeighboursStates(state: GameState): GameState[] {
        const gameObject = this.gameMap.data[state.pacmanPosition.y][state.pacmanPosition.x];
        const neighbours = this.getNeighbours(gameObject);
        const states: GameState[] = [];

        for (const neighbour of neighbours) {
            if (neighbour instanceof Wall) {
                continue;
            }
            const remainingPellets = Array.from(state.remainingPellets);

            if (neighbour instanceof Pellet) {
                remainingPellets[this.pelletIndices.get(neighbour)!] = false;
            }

            states.push(new GameState(neighbour.position, remainingPellets));
        }

        return states;
    }

    getNeighbours(gameObject: GameObject): GameObject[] {
        const res: GameObject[] = [];
        const position = gameObject.position;

        if (position.x > 0) {
            res.push(this.gameMap.data[position.y][position.x - 1]);
        }


        if (position.x < this.gameMap.width - 1) {
            res.push(this.gameMap.data[position.y][position.x + 1]);
        }

        if (position.y > 0) {
            res.push(this.gameMap.data[position.y - 1][position.x]);
        }

        if (position.y < this.gameMap.height - 1) {
            res.push(this.gameMap.data[position.y + 1][position.x]);
        }

        return res;
    }
}
