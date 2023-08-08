import {Map} from '../model/map'
import {MapData} from '../model/map-data'


export class MapLoader {
    static loadMap(id: number): Map | undefined {
        const maps = MapLoader.loadMaps();
        return maps.find((map) => map.id === id);
    }

    static loadMaps(): Map[] {
        const maps: MapData[] = [
            require('../assets/map-data/standart.json'),
            require('../assets/map-data/corners.json'),
            require('../assets/map-data/maze.json')
        ]
        return maps.map((mapData) => new Map(mapData.id, mapData.name, mapData.data))
    }
}
