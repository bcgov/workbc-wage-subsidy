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
                    style={{ width: "100%", height: "700px" }}
                ></iframe>
            </div>
        </Create>
    ) : (
        <div>Loading</div>
    )
}
