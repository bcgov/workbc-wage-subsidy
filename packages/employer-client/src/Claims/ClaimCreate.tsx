import { Create, ReferenceInput, SelectInput, SimpleForm, useGetIdentity, usePermissions } from "react-admin"
import { useWatch } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import ClaimPreview from "./Preview"

const FormReferenceInput = (props: any) => {
    const wageId: any = useWatch({ name: "confirmationid" })
    console.log(wageId)
    return (
        <>
            <ReferenceInput {...props}>
                <SelectInput label={"Form"} optionText="confirmationid" />
            </ReferenceInput>
            {console.log(wageId)}
            {wageId && <ClaimPreview id={wageId} resource={"wage"} />}
        </>
    )
}

export const ClaimCreate = (props: any) => {
    const { isLoading, permissions, error } = usePermissions()
    const { identity, isLoading: identityLoading } = useGetIdentity()
    //const [storeFronts, setStoreFronts] = useState<Array<any>>([])
    //const [catchments, setCatchments] = useState<Array<any>>([])
    //const {token} = ("token")
    console.log(error)
    console.log(permissions)

    /*
    const getCatchments = (ca) => {
        console.log(ca)
        let choices: any[] = []
        ca.forEach((c, i) => {
            choices.push({
                id: i + 1,
                name: c
            })
        })
        return choices
    }

    /*
  const getStoreFront = (ca) => {
    console.log(ca)
    console.log(catchments)
    const info = catchments.find(c => c.CatchmentNo === String(ca))
    console.log(info)
    return info.Storefronts
  }
  */
    /*
    const getDisplayInfo = (ca, sf) => {
        const caInfo = catchments.find((c) => c.CatchmentNo === String(ca))
        console.log(caInfo)
        const sfInfo = caInfo.Storefronts.find((s) => s.id === sf)
        return (
            <>
                <p>Catchment Name: {caInfo.Title}</p>
                <p>WorkBC Centre: {sfInfo.name}</p>
                <p>WorkBC Centre Address: {sfInfo.Address}</p>
                <p>WorkBC Centre Phone: {sfInfo.Phone}</p>
            </>
        )
    }
    */
    /*
  React.useEffect(() => {
    
    async function getCatchments() {
      const getCatchmentInfoRequest = new Request(
        `http://localhost:8000/Common/Catchments`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          })
        }
      )
      try {
        const ca = await fetch(getCatchmentInfoRequest)
          .then(response => {
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then(c => {
            console.log(c)
            return c
          })
          setCatchments(ca)
      } catch (error: any) {
        console.log(error)
      }
    }
    getCatchments()

  }, [])
  */

    const defaultValues = {
        formKey: uuidv4(),
        userName: identity?.username || "",
        guid: identity?.guid || ""
    }
    return !isLoading && !identityLoading && permissions ? (
        <Create {...props}>
            {console.log(identity)}
            <SimpleForm defaultValues={defaultValues}>
                <FormReferenceInput
                    label="Application"
                    source="confirmationid"
                    reference="wage"
                    filter={{ status: ["submitted", "inProgress"] }}
                />
                {/*
        <SelectInput source="catchment" choices={getCatchments(permissions.catchments)} />
        <FormDataConsumer>
          {({ formData, ...rest }) => (
            (formData.catchment >= 1) &&
            <SelectInput label="WorkBC Centre" source="storefront" emptyValue={"Please select catchment"} choices={getStoreFront(formData.catchment)} {...rest} />
          )}
        </FormDataConsumer>
        
        <FormDataConsumer>
        {({ formData, ...rest }) => ( 
          (formData.catchment >= 1 && formData.storefront >= 1) &&
          <>
            <p>The following information will be set on the form (if applicable)</p>
            {getDisplayInfo(formData.catchment, formData.storefront)}
          </>
        )}
        </FormDataConsumer>
        {/*<FormReferenceInput label="Form" source="code" reference="formTemplates" /*/}
            </SimpleForm>
        </Create>
    ) : (
        <div>Loading</div>
    )
}
