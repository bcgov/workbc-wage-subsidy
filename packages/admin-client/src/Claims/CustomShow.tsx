/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/prefer-default-export */
import { ResponsiveStyleValue, Stack, styled, SxProps } from "@mui/system"
import clsx from "clsx"
import PropTypes from "prop-types"
import { Children, isValidElement, ReactNode } from "react"
import { Labeled, OptionalRecordContextProvider, RaRecord, useRecordContext } from "react-admin"

export const CustomShow = (props: CustomShowProps) => {
    const { className, children, divider, spacing = 1, ...rest } = props
    const record = useRecordContext(props)
    if (!record) {
        return null
    }
    return (
        <OptionalRecordContextProvider value={props.record}>
            <Root className={className} {...sanitizeRestProps(rest)}>
                <Stack spacing={spacing} divider={divider} className={SimpleShowLayoutClasses.stack}>
                    {Children.map(children, (field) =>
                        field && isValidElement<any>(field) && record[field.props.source] !== null ? (
                            <Labeled
                                key={field.props.source}
                                className={clsx(
                                    "ra-field",
                                    field.props.source && `ra-field-${field.props.source}`,
                                    SimpleShowLayoutClasses.row,
                                    field.props.className
                                )}
                            >
                                {field}
                            </Labeled>
                        ) : null
                    )}
                </Stack>
            </Root>
        </OptionalRecordContextProvider>
    )
}

export interface CustomShowProps {
    children: ReactNode
    className?: string
    divider?: ReactNode
    record?: RaRecord
    spacing?: ResponsiveStyleValue<number | string>
    sx?: SxProps
}

CustomShow.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    divider: PropTypes.any,
    record: PropTypes.object,
    spacing: PropTypes.any,
    sx: PropTypes.any
}

const PREFIX = "RaSimpleShowLayout"

export const SimpleShowLayoutClasses = {
    stack: `${PREFIX}-stack`,
    row: `${PREFIX}-row`
}

const Root = styled("div", {
    name: PREFIX,
    overridesResolver: (props: any, styles: any) => styles.root
})(({ theme }) => ({
    flex: 1,
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    [`& .${SimpleShowLayoutClasses.stack}`]: {},
    [`& .${SimpleShowLayoutClasses.row}`]: {
        display: "inline"
    }
}))

const sanitizeRestProps = ({ record, resource, initialValues, translate, ...rest }: any) => rest
