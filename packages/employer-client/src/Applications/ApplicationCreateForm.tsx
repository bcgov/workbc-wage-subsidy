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

export const ApplicationCreateForm = (props: any) => {
    const { formType } = useParams()
    const { isLoading, permissions } = usePermissions()
    const { identity, isLoading: identityLoading } = useGetIdentity()
    const defaultValues = {
        formKey: uuidv4(),
        guid: identity?.guid || ""
    }
    // TODO: use current value of formType to obtain form URL.

    return !isLoading && !identityLoading && permissions ? (
        <Create {...props}>
            <SimpleForm defaultValues={defaultValues} toolbar={<CustomToolbar />}>
                <SelectInput
                    source="formType"
                    label="Application Type"
                    choices={[
                        { id: "Have Employee", name: "Have Employee" },
                        { id: "Need Employee", name: "Need Employee" }
                    ]}
                    validate={required()}
                    defaultValue={
                        formType === "HaveEmployee"
                            ? "Have Employee"
                            : formType === "NeedEmployee"
                            ? "Need Employee"
                            : ""
                    }
                />
            </SimpleForm>
        </Create>
    ) : (
        <div>Loading</div>
    )
}
