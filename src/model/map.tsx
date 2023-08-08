import {GameObject} from "./game-object";
import {Way} from "./way";
import {Wall} from "./wall";
import {Pellet} from "./pellet";
import {Pacman} from "./pacman";
import {Position} from "./position";

export class Map {
    id: number

    name: string

    height: number

    width: number

    data: GameObject[][]

    constructor(id: number, name: string, data: string) {
        const lines: string[] = data.split('\n').filter((line) => line.length !== 0)
        this.id = id
        this.name = name
        this.height = lines.length
        this.width = lines[0].length
        this.data = Array.from(Array(this.height), () => new Array(this.width))

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const position = new Position(j, i);
                const character = lines[i][j];
                switch (character) {
                    case '#':
                        this.data[i][j] = new Wall(position);
                        break
                    case ' ':
                        this.data[i][j] = new Way(position);
                        break
                    case '.':
                        this.data[i][j] = new Pellet(position);
                        break
                    case '@':
                        this.data[i][j] = new Pacman(position);
                        break
                    default:
                        this.data[i][j] = new Way(position);
                        break
                }
            }
        }
    }
}
