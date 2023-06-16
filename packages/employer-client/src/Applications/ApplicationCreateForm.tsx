import { Create, useGetIdentity, usePermissions } from "react-admin"
import { v4 as uuidv4 } from "uuid"

export const ApplicationCreateForm = (props: any) => {
    const { isLoading, permissions, error } = usePermissions()
    const { identity, isLoading: identityLoading } = useGetIdentity()
    const defaultValues = {
        formKey: uuidv4(),
        userName: identity?.username || "",
        guid: identity?.guid || ""
    }

    return !isLoading && !identityLoading && permissions ? (
        // <Create {...props}>
        //     <SimpleForm defaultValues={defaultValues}>
        //         <SelectInput
        //             source="formtype"
        //             label="Application Type"
        //             emptyValue={"Please select application"}
        //             choices={[
        //                 { id: "haveEmployee", name: "Have Employee" },
        //                 { id: "needEmployee", name: "Need Employee" }
        //             ]}
        //         />
        //     </SimpleForm>
        // </Create>
        <Create {...props}>
            <div style={{ position: "relative", height: "700px" }}>
                <div
                    style={{ backgroundColor: "white", width: "100%", height: "58px", position: "absolute", zIndex: 1 }}
                >
                    &nbsp;
                </div>
                <iframe
                    title="test-form"
                    id="support-form"
                    src={props.formUrl}
                    // src="https://forms-dev.es.workbc.ca/app/form/submit?f=8e760934-87e7-4785-b3a2-11e8fe9027b4"
                    style={{ width: "100%", height: "700px" }}
                ></iframe>
            </div>
        </Create>
    ) : (
        <div>Loading</div>
    )
}
