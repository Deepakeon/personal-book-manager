import { RefObject, useEffect, useEffectEvent } from "react"

export const useClickOutside = (ref: RefObject<HTMLElement | null>, handler: (e: MouseEvent) => void) => {
const onEvent = useEffectEvent(handler)

useEffect(() => {
    window.addEventListener("click", (e) => {
        if(ref?.current && !ref.current.contains(e.target as HTMLElement)) {
            onEvent(e)
        }
    }, false)
    return () => window.removeEventListener("click", onEvent, false)
}, [ref])
}