import './home-page.scss'
import '../../model/map'
import {Link} from "react-router-dom";
import banner from '../../assets/images/banner.png'
import {MapLoader} from "../../helpers/map-loader";
import {Map} from "../../model/map";


export function HomePage() {
    const loadedMaps: Map[] = MapLoader.loadMaps();
    return (
        <div id={'game-menu'}>
            <img id={'pacman-banner'} src={banner} alt={'Pacman Banner'}/>
            <section className={'menu-options'}>
                {
                    loadedMaps.map((map) => {
                        return <Link to={`/game/${map.id}`} key={map.id} className={'menu-option'}>{map.name}</Link>;
                    })
                }
            </section>
        </div>
    );
}
