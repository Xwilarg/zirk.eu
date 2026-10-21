import { useEffect } from "react";
import { UnlockAchievement } from "../models/Achievement";
import { useLocation } from "react-router";
import { NavigationLinks } from "../components/NavbarComponent";

export default function CommonForm() {

    const { pathname } = useLocation();

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
            UnlockAchievement("AFK");
        }, 3_600_000);

        const urls = tryStorePage(pathname)
        if (NavigationLinks.every(x => urls.includes(x.to))) UnlockAchievement("ALL_NAVIGATION")

        return () => {
            clearTimeout(achTimeout);
        }
    }, [ pathname ]);

    return <></>
}