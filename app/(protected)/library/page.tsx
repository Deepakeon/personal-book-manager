"use client"

import Library from "@/components/Library"
import { Suspense } from "react"

const LibraryPage = () => {
    return <Suspense fallback={"Loading your library..."}>
        <Library />
    </Suspense>
}

export default LibraryPage