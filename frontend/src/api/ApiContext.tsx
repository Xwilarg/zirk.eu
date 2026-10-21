import { createContext, useMemo, type PropsWithChildren } from "react";
import { Api } from "./api";

export const ApiContext = createContext<Api | null>(null)

export default function ApiProvider({ children }: PropsWithChildren) {
    const api = useMemo(() => new Api(), [])

    return (
        <ApiContext.Provider value={api}>
            { children }
        </ApiContext.Provider>
    )
}