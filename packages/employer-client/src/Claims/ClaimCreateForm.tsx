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
    const { appId } = useParams()
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
                    source="applicationid"
                    label="Assoc. App ID"
                    choices={[{ id: appId?.toString(), name: appId?.toString() }]}
                    validate={required()}
                    defaultValue={appId}
                />
            </SimpleForm>
        </Create>
    ) : (
        <div>Loading</div>
    )
}
