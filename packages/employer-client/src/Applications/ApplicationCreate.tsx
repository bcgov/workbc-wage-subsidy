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
            {/* <div style={{ position: "relative", height: "700px" }}>
                <div
                    style={{ backgroundColor: "white", width: "100%", height: "58px", position: "absolute", zIndex: 1 }}
                >
                    &nbsp;
                </div>
                <iframe
                    id="support-form"
                    src="https://forms-dev.es.workbc.ca/app/form/submit?f=47794263-67fd-490e-b6ad-c26313b2563a"
                    style={{ width: "100%", height: "700px" }}
                ></iframe>
            </div> */}
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
