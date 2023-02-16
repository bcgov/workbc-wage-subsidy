import { Edit, ListButton, SaveButton, SimpleForm, TextInput, Toolbar } from "react-admin"

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton label="Save" />
        <ListButton
            label="Back to Applications"
            sx={{ height: "30px", padding: "16px 6px", marginLeft: "8px" }}
            icon={<></>}
        />
    </Toolbar>
)

export const ApplicationEdit = () => (
    <Edit>
        <SimpleForm toolbar={<CustomToolbar />}>
            <TextInput label="BCeIDs shared with" source="sharedwith" />
            <TextInput label="Catchment Number" source="catchmentno" />
        </SimpleForm>
    </Edit>
)
