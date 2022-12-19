import { Identifier, RaRecord, ResourceContextProvider, SimpleShowLayout, TextField } from "react-admin"
import { useQueryClient } from "react-query"

const ClaimPreview = <RecordType extends RaRecord = any>({ id, resource }: { id: Identifier; resource: string }) => {
    const queryClient = useQueryClient()
    const record = queryClient.getQueryData<RecordType>([resource, "getOne", { id: String(id) }])
    console.log(record)
    return (
        <ResourceContextProvider value={resource}>
            <SimpleShowLayout record={record}>
                <TextField source="id" />
                <TextField source="confirmationid" />
                <TextField source="positiontitle0" />
            </SimpleShowLayout>
        </ResourceContextProvider>
    )
}

export default ClaimPreview
