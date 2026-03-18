import { useEffect, useEffectEvent } from "react"

export const useKeyboardEvent = (handler: (e: WindowEventMap["keydown"]) => void) => {
    const onEvent = useEffectEvent(handler)

    useEffect(() => {
        window.addEventListener("keydown", onEvent)

        return () => {
            window.removeEventListener("keydown", onEvent)
        }
    }, [])
}