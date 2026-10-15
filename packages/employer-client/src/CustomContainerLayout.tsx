import { Container, ContainerProps } from "@mui/material"
import { styled, SxProps } from "@mui/material/styles"
import clsx from "clsx"
import React, { ComponentType, ErrorInfo, HtmlHTMLAttributes, ReactNode, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"

import {
    CoreLayoutProps,
    Error,
    ErrorProps,
    SkipNavigationButton
    // FIXME: add this when the react-admin dependency is updated
    //Inspector,
} from "react-admin"
import { Header } from "./CustomHeader"
import { CustomSkipNavigationButton } from "./CustomSkipNavigationButton"

export const CustomContainerLayout = (props: LayoutProps) => {
    const {
        appBar,
        children,
        className,
        error: errorComponent,
        menu,
        title,
        toolbar,
        maxWidth,
        fixed,
        userMenu,
        sx
    } = props

    const [errorInfo, setErrorInfo] = useState<any>(null)

    const handleError = (error: Error, componentStack: ErrorInfo) => {
        setErrorInfo(componentStack)
    }

    return (
        <StyledLayout className={clsx("layout", ContainerLayoutClasses.root, className)} sx={sx}>
            <CustomSkipNavigationButton />
            {appBar !== undefined ? appBar : <Header menu={menu} toolbar={toolbar} userMenu={userMenu} />}
            <Container id="main-content" className={ContainerLayoutClasses.content} maxWidth={maxWidth} fixed={fixed}>
                <ErrorBoundary
                    onError={handleError as any}
                    fallbackRender={({ error, resetErrorBoundary }) => (
                        <Error
                            error={error}
                            errorComponent={errorComponent}
                            errorInfo={errorInfo}
                            resetErrorBoundary={resetErrorBoundary}
                            title={title}
                        />
                    )}
                >
                    {children}
                </ErrorBoundary>
            </Container>
            {/* <Inspector /> */}
        </StyledLayout>
    )
}

export interface LayoutProps extends Omit<CoreLayoutProps, "menu">, Omit<HtmlHTMLAttributes<HTMLDivElement>, "title"> {
    appBar?: ReactNode
    className?: string
    error?: ComponentType<ErrorProps>
    fixed?: ContainerProps["fixed"]
    maxWidth?: ContainerProps["maxWidth"]
    menu?: ReactNode
    sidebar?: ComponentType<{ children: ReactNode }>
    sx?: SxProps
    toolbar?: ReactNode
    userMenu?: ReactNode
}

export interface LayoutState {
    hasError: boolean
    error?: Error
    errorInfo?: ErrorInfo
}

const PREFIX = "RaContainerLayout"
export const ContainerLayoutClasses = {
    root: `${PREFIX}-root`,
    content: `${PREFIX}-content`
}

const StyledLayout = styled("div", {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root
})(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
    minHeight: `100vh`
}))
