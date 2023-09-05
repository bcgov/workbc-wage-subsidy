import {
    Create,
    SaveButton,
    SelectInput,
    SimpleForm,
    Toolbar,
    required,
    useGetIdentity,
    usePermissions
} from "react-admin"
import { useParams } from "react-router"
import { v4 as uuidv4 } from "uuid"

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton alwaysEnable />
    </Toolbar>
)

export const ClaimCreateForm = (props: any) => {
    const { appID } = useParams()
    const { isLoading, permissions } = usePermissions()
    const { identity, isLoading: identityLoading } = useGetIdentity()
    const defaultValues = {
        formKey: uuidv4(),
        userName: identity?.username || "",
        guid: identity?.guid || ""
    }

    return !isLoading && !identityLoading && permissions ? (
        <Create {...props}>
            <SimpleForm defaultValues={defaultValues} toolbar={<CustomToolbar />}>
                <SelectInput
                    source="application_id"
                    label="Assoc. App ID"
                    choices={[{ id: appID?.toString(), name: appID?.toString() }]}
                    validate={required()}
                    defaultValue={appID}
                />
            </SimpleForm>
        </Create>
    ) : (
        <div>Loading</div>
    )
}
