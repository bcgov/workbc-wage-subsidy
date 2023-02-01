import { Edit, SimpleForm, TextInput } from "react-admin"

export const ApplicationEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput label="BCeIDs shared with" source="sharedwith" />
        </SimpleForm>
    </Edit>
)
