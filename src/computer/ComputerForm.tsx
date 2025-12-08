import ScreenSaverForm from "./impl/ScreenSaverForm";

export default function SketchForm() {
    return <>
        <div className="container">
            <ScreenSaverForm/>
        </div>
        <div className="container is-flex">
            <button><span className="material-symbols-outlined">power_settings_new</span></button>
            <button><span className="material-symbols-outlined">eject</span></button>
        </div>
    </>
}