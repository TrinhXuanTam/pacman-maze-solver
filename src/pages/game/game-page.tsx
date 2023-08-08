import {Navigate, useParams} from "react-router-dom";
import {MapLoader} from "../../helpers/map-loader";
import React, {useState} from "react";
import {GameMap} from "./components/game-map";
import './game-page.scss'
import {PacmanSearch} from "../../model/pacman-search";
import Loader from '../../assets/images/loader.gif'
import {Position} from "../../model/position";

export function GamePage() {
    const [isFetching, setIsFetching] = useState(true);
    const {id} = useParams()
    const [map] = useState(MapLoader.loadMap(Number(id)));
    const [path, setPath] = useState<Position[]>([]);
    const [initPos, setInitialPosition] = useState<Position>();

    if (map === undefined) {
        return <Navigate to='/'/>;
    }

    if (isFetching) {
        return <img
            src={Loader}
            alt='Loader'
            onLoad={async () => {
                const search = new PacmanSearch(map)
                await search.init();
                setPath(search.findOptimalPath());
                setInitialPosition(search.startPosition);
                setIsFetching(false);
            }}
        />;
    }

    return <GameMap map={map} path={path} initialPosition={initPos!}/>;
}
