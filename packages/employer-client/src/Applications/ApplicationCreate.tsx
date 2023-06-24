import { Create, SelectInput, SimpleForm, useGetIdentity, usePermissions } from "react-admin"
import { v4 as uuidv4 } from "uuid"

export const ApplicationCreate = (props: any) => {
    const { isLoading, permissions, error } = usePermissions()
    const { identity, isLoading: identityLoading } = useGetIdentity()
    const defaultValues = {
        formKey: uuidv4(),
        userName: identity?.username || "",
        guid: identity?.guid || ""
    }

    return !isLoading && !identityLoading && permissions ? (
        <Create {...props}>
            <SimpleForm defaultValues={defaultValues}>
                <SelectInput
                    source="formType"
                    label="Application Type"
                    emptyValue={"Please select application"}
                    choices={[
                        { id: "Have Employee", name: "Have Employee" },
                        { id: "Need Employee", name: "Need Employee" }
                    ]}
                />
            </SimpleForm>
        </Create>
    ) : (
        <div>Loading</div>
    )
}
