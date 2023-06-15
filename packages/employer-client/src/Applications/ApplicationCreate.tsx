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
                    source="formtype"
                    label="Application Type"
                    emptyValue={"Please select application"}
                    choices={[
                        { id: "haveEmployee", name: "Have Employee" },
                        { id: "needEmployee", name: "Need Employee" }
                    ]}
                />
            </SimpleForm>
        </Create>
    ) : (
        <div>Loading</div>
    )
}
