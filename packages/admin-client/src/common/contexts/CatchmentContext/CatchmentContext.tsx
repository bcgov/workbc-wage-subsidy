import { createContext, useState, useEffect, useMemo } from "react"

const createCatchmentName = (catchmentNo: number, location: string) => {
    let catchmentName = catchmentNo < 10 ? "0" : ""
    return catchmentName + catchmentNo.toString() + " - " + location
}

const getCatchments = () => {
    // eslint-disable-next-line prefer-const
    let result: any[] | undefined = []
    const provider = localStorage.getItem("provider")
    const permissions = localStorage.getItem("permissions")
    const access = localStorage.getItem("true")
    if (provider === "BCEID" && permissions !== null) {
        JSON.parse(permissions).forEach((item: { catchmentNo: number; location: string }) => {
            result?.push({
                id: item.catchmentNo,
                name: createCatchmentName(item.catchmentNo, item.location)
            })
        })
    } else if (provider === "IDIR" && access === "true") {
        for (let i = 1; i <= 45; i += 1) {
            result?.push({ id: i, name: `${i}` })
        }
    }
    return result
}

interface CatchmentContextState {
    catchments: any[]
    catchment: { id: number; name: string }
    changeCatchment: (catchmentNo: number) => void
    children?: React.ReactNode
}

const CatchmentContext = createContext<CatchmentContextState>({
    catchments: [],
    catchment: { id: -1, name: "" },
    changeCatchment: () => {}
})

const CatchmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [catchments, setCatchments] = useState<any[]>(getCatchments())
    const [catchment, setCatchment] = useState<{ id: number; name: string }>(
        // Initialize catchment number to -1, so no records are obtained until catchments are known.
        catchments.length === 0 ? { id: -1, name: "" } : catchments[0]
    )

    const changeCatchment = (catchmentNo: number) => {
        setCatchment(catchments[catchments.findIndex((item) => item.id === catchmentNo)])
    }

    useEffect(() => {
        // When token refreshes, update catchments list.
        window.addEventListener("storage", () => {
            setCatchments(getCatchments())
        })
    }, [])

    useEffect(() => {
        // If catchment list changes, maintain current selection if it exists. Otherwise set to first in list.
        if (catchments.length > 0 && !catchments.some((item) => item.id === catchment.id)) {
            setCatchment(catchments[0])
        }
    }, [catchments, catchment])

    // Use memoization to prevent unnecessary re-renders.
    const valueProp = useMemo(() => ({ catchments, catchment, changeCatchment }), [catchments, catchment])

    return <CatchmentContext.Provider value={valueProp}>{children}</CatchmentContext.Provider>
}

export { CatchmentContext, CatchmentProvider }
