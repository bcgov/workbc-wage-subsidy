import { CreateButton, TopToolbar } from "react-admin"

interface ListActionsProps {
    createButtonLabel: string
}

export const ListActions: React.FC<ListActionsProps> = ({ createButtonLabel }) => (
    <TopToolbar sx={{ paddingTop: "5vh" }}>
        <div>
            <CreateButton label={createButtonLabel} />
        </div>
    </TopToolbar>
)
