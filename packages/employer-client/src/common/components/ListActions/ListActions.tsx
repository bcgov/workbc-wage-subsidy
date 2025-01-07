import { CreateButton, TopToolbar } from "react-admin"

interface ListActionsProps {
    createButtonLabel: string
}

export const ListActions: React.FC<ListActionsProps> = ({ createButtonLabel }) => (
    <TopToolbar>
        <div>
            <CreateButton label={createButtonLabel} />
        </div>
    </TopToolbar>
)
