import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { GameJamItem } from "../models/api/Gamejam";
import type { SketchFormProps } from "../computer/SketchForm";
import GameJamBox from "../boxes/impl/GameJamBox";
import QuoteComponent from "../components/QuoteComponent";
import SketchForm from "../computer/SketchForm";
import GenericBox from "../boxes/GenericBox";
import NavbarComponent from "../components/NavbarComponent";
import GameJamFiltersComponent from "../components/GameJamFiltersComponent";
import { useApi } from "../api/useApi";
import { isNsfwNumber } from "../utils";
import type { FriendItem } from "../models/api/Friend";

export default function GameJamForm() {
    const api = useApi();
    const nsfwNb = isNsfwNumber();

    const [searchParams, setSearchParams] = useSearchParams();

    const [gamejams, setGamejams] = useState<GameJamItem[]>([]);
    const [filteredGamejams, setFilteredGamejams] = useState<GameJamItem[]>([]);
    const [friends, setFriends] = useState<FriendItem[]>([]);
    
    const [shownSketch, setShownSketch] = useState<GameJamItem | null>(null);
    const [computerProps, setComputerProps] = useState<SketchFormProps | null>(null);
    
    const [embedGotUserClick, setEmbedGotUserClick] = useState(false);

    useEffect(() => {
        api.getGamejams(nsfwNb).then(x => { setGamejams(x); setFilteredGamejams(x); });
        api.getFriends().then(x => setFriends(x));
    }, []);

    useEffect(() => {
        const game = searchParams.get("share")?.toUpperCase();

        if (game) {
            let target = gamejams.find(x => x.name?.toUpperCase() === game);
            if (target && target.sketch) {
                setShownSketch(target);
            } else {
                setShownSketch(null);
            }
        } else {
            setShownSketch(null);
        }
    }, [searchParams, gamejams]);
    
    useEffect(() => {
        if (shownSketch) {
            setComputerProps({
                isOn: true,
                loadedGame: {
                    defaultResFolder: shownSketch.sketch!.folder,
                    defaultFilename: shownSketch.sketch!.filename!,
                    defaultEngine: shownSketch.engine,
                    defaultUnityVersion: shownSketch.version
                },
                buttons: [],
                isFullscreen: false,
                onLoad: null
            });
        } else {
            setComputerProps(null);
        }
    }, [ shownSketch ]);

    if (computerProps !== null && shownSketch !== null)
    {
        return <>
            <div className="is-flex flex-center-hor">
            {
                embedGotUserClick ?
                    <SketchForm
                        isOn={computerProps.isOn}
                        loadedGame={computerProps.loadedGame}
                        buttons={[]}
                        isFullscreen={true}
                        onLoad={null}
                    />
                    : <div id="screen-container" className=" fullscreen is-flex flex-center-hor flex-center-ver">
                        <button className="big" onClick={() => setEmbedGotUserClick(true)}>Play</button>
                    </div>
            }
            </div>
            <div className="is-flex flex-center-hor">
                <GenericBox name="Help" text={shownSketch!.controls.join("<br/>") + "<br/><br/>" + shownSketch!.help.join("<br/>")} nsfw={false} />
            </div>
        </>
    }

    return (
        <>
            <QuoteComponent />
            <NavbarComponent />
            <div className="is-flex flex-center-hor">
                <GameJamFiltersComponent items={gamejams} setJamItems={setFilteredGamejams} friends={friends} />
            </div>
            <h3 className="text-center">{filteredGamejams.length} entr{filteredGamejams.length > 1 ? "ies" : "y"}</h3>
            <div className="is-flex flex-center-hor">
                {
                    filteredGamejams
                        .map((x: GameJamItem) => <GameJamBox key={x.fullName} item={x} loadGame={() => {
                            setSearchParams(sp => {
                                sp.set("share", x.name);
                                return sp;
                            });
                        }} />)
                }
            </div>
        </>
    )
}