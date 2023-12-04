import { createContext, useMemo, useState } from "react"

interface EmployerContextState {
    profileExists: boolean
    setEmployerProfileExists: (value: boolean) => void
}

const EmployerContext = createContext<EmployerContextState>({
    profileExists: false,
    setEmployerProfileExists: () => {}
})

const EmployerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profileExists, setProfileExists] = useState<boolean>(false)

    const setEmployerProfileExists = (value: boolean) => {
        setProfileExists(value)
    }

    // Use memoization to prevent unnecessary re-renders.
    const valueProp = useMemo(() => ({ profileExists, setEmployerProfileExists }), [profileExists])

    return <EmployerContext.Provider value={valueProp}>{children}</EmployerContext.Provider>
}

export { EmployerContext, EmployerProvider }
