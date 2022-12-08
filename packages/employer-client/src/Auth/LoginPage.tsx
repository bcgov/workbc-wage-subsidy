import * as React from "react"
import { useState } from "react"
import { Button } from "@mui/material"
import { useLogin, useNotify, Notification } from "react-admin"

const LoginPage = () => {
    const login = useLogin()
    return (
        <>
            <Button
                onClick={() => {
                    login("idir")
                }}
            >
                IDIR
            </Button>
            <Button
                onClick={() => {
                    login("bceid")
                }}
            >
                BCeID
            </Button>
        </>
    )
}

export default LoginPage
