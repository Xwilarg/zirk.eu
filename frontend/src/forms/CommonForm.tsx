import { useEffect } from "react";
import { useLocation } from "react-router";
import { NavigationLinks } from "../components/NavbarComponent";
import { useApi } from "../api/useApi";

export default function CommonForm() {

    const { pathname } = useLocation();
    const api = useApi();

    function tryStorePage(name: string): string[] {
        let names = JSON.parse(localStorage.getItem("pa_vi") ?? "[]") as string[]
        if (!names.includes(name)) {
            names.push(name);
            localStorage.setItem("pa_vi", JSON.stringify(names));
        }

        return names;
    }

    useEffect(() => {
        const achTimeout = setTimeout(() => {
            api.unlockAchievement("AFK");
        }, 3_600_000);

        const urls = tryStorePage(pathname)
        if (NavigationLinks.every(x => urls.includes(x.to))) api.unlockAchievement("ALL_NAVIGATION")

        return () => {
            clearTimeout(achTimeout);
        }
    }, [ pathname ]);

    return <></>
}