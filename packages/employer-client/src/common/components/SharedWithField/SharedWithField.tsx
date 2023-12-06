import { Chip, Tooltip } from "@mui/material"
import { FunctionField } from "react-admin"

interface SharedWithFieldProps {
    // Label must be passed as prop for it to be extracted into column header by React Admin.
    label: string
    openModal: (formId: any, sharedUsers: any) => void
}

export const SharedWithField: React.FC<SharedWithFieldProps> = ({ label, openModal }) => {
    return (
        <FunctionField
            label="Shared With"
            render={(record: any) => {
                const sortedNames = record["shared_with"].sort((a, b) => a.localeCompare(b))
                const chipLabel =
                    sortedNames.length === 0
                        ? "None"
                        : sortedNames.length === 1
                        ? sortedNames
                        : sortedNames.length === 2
                        ? sortedNames[0] + ", " + (sortedNames.length - 1) + " other"
                        : sortedNames[0] + ", " + (sortedNames.length - 1) + " others"

                return (
                    <div>
                        {/* To prevent screen reader from reading label as a 'group', only render tooltip if clickable.*/}
                        {record["shared_with"].length > 1 ? (
                            <Tooltip title="View all shared users" aria-label={chipLabel + ". View all shared users."}>
                                <Chip
                                    label={chipLabel}
                                    size="small"
                                    clickable
                                    onClick={() => openModal(record.form_confirmation_id, sortedNames)}
                                />
                            </Tooltip>
                        ) : (
                            <Chip label={chipLabel} size="small" />
                        )}
                    </div>
                )
            }}
        />
    )
}
