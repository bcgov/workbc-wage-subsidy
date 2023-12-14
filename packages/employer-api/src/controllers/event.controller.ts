/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as applicationService from "../services/application.service"
import * as claimService from "../services/claim.service"
import * as employerService from "../services/employer.service"
import * as formService from "../services/form.service"
import * as emailController from "./email.controller"

export const submission = async (req: express.Request, res: express.Response) => {
    try {
        const { formType } = req.params
        const passedKey = req.headers["x-api-key"]
        if (!formType) {
            return res.status(400).send("Form type parameter required")
        }
        let formPass
        if (formType === "HaveEmployeeForm") {
            formPass = process.env.HAVE_EMPLOYEE_PASS
        } else if (formType === "NeedEmployeeForm") {
            formPass = process.env.NEED_EMPLOYEE_PASS
        } else if (formType === "ClaimForm") {
            formPass = process.env.CLAIM_FORM_PASS
        } else if (formType === "ServiceProviderClaimForm") formPass = process.env.SP_CLAIM_FORM_PASS

        if (!formPass) {
            return res.status(400).send("Invalid form type parameter provided")
        }
        if (!passedKey || passedKey !== formPass) {
            return res.status(401).send("Invalid api key")
        }

        const submissionResponse = await formService.getSubmission(req.body.formId, formPass, req.body.submissionId)
        const submission = submissionResponse?.submission?.submission
        if (!submission) {
            console.log("formService getSubmission failed")
            return res.status(500).send("Internal Server Error")
        }
        console.log("RETRIEVED SUBMISSION: ", submissionResponse)

        // Claim Form submission events //
        if (formType === "ClaimForm") {
            if (submissionResponse.submission.draft === true) {
                const claim = await claimService.getClaimBySubmissionID(req.body.submissionId)
                if (claim?.status !== "Draft") {
                    return res.status(500).send("Internal Server Error")
                }
                console.log("updating saved claim for id ", claim.id)
                const updateResult = await claimService.updateClaim(
                    claim.id,
                    "Draft",
                    submissionResponse.submission,
                    false
                )
                if (updateResult === 1) {
                    console.log("claim record update successful for id ", claim.id)
                    return res.status(200).send()
                }
                console.log("Unable to update claim database entry")
                return res.status(500).send("Internal Server Error")
            }
            const serviceProviderInternalID = `SPx${submission.data.internalId}` // create a new internal id for the SP form
            const createDraftResult = await formService.createTeamProtectedDraft(
                process.env.SP_CLAIM_FORM_ID as string,
                process.env.SP_CLAIM_FORM_PASS as string,
                process.env.SP_CLAIM_FORM_VERSION_ID as string,
                serviceProviderInternalID,
                submission.data
            )
            if (createDraftResult?.id && createDraftResult.submission) {
                const addResult = await claimService.addServiceProviderClaim(
                    submissionResponse,
                    serviceProviderInternalID,
                    createDraftResult.id
                )
                if (addResult === 1) {
                    console.log("claim record update successful")
                    // Get the newly added record
                    const newSPClaim = await claimService.getServiceProviderClaimByInternalId(serviceProviderInternalID)
                    if (newSPClaim === null) {
                        console.log("Error retrieving new claim")
                        return res.status(500).send("Internal Server Error")
                    }
                    // Send notifications to clients with Claims notifications enabled
                    await emailController
                        .sendEmail({
                            // email controller expects the data to be wrapped in a data object
                            data: {
                                catchmentNo: newSPClaim.catchmentno,
                                applicationType: "Claims"
                            }
                        })
                        .catch((e) => {
                            console.log("Error sending notifications", e)
                            return res.status(500).send("Internal Server Error")
                        })
                    return res.status(200).send()
                }

                console.log("Unable to update claim database entry")
                return res.status(500).send("Internal Server Error")
            }

            console.log("Unable to create new service provider claim form")
            return res.status(500).send("Internal Server Error")
        }

        // Service Provider Claim Form draft submission events - triggered on calculator approval //
        if (formType === "ServiceProviderClaimForm") {
            if (submission.data.customEvent !== true) {
                console.log("not a custom event - ignoring")
                return res.status(200).send("not a custom event - ignoring")
            }
            if (submissionResponse.submission.draft !== true) {
                console.log("service provider claim form submission events should not occur")
                return res.status(400).send("service provider claim form submission events should not occur")
            }
            // Update the claim form entry //
            const updateResult = await claimService.updateServiceProviderClaim(submissionResponse)
            if (updateResult === 1) {
                console.log("claim record update successful")
                return res.status(200).send()
            }

            console.log("Unable to update claim database entry")
            return res.status(500).send("Internal Server Error")
        }

        // Application forms //
        if (formType === "HaveEmployeeForm" || formType === "NeedEmployeeForm") {
            const application = await applicationService.getApplicationBySubmissionID(req.body.submissionId)
            if (application?.status === "Draft") {
                let updateResult
                if (submissionResponse.submission.draft === false) {
                    console.log("updating submitted application for id ", application.id)
                    updateResult = await applicationService.updateApplication(
                        application.id,
                        "New",
                        submissionResponse.submission,
                        false
                    )
                    // If first application submitted, backfill employer profile from form data.
                    const firstApplicationSubmitted = await applicationService.oneApplicationSubmitted(
                        application.created_by
                    )
                    if (firstApplicationSubmitted) {
                        const employer = await employerService.getEmployerByID(application.created_by)
                        if (!employer) {
                            throw new Error("Internal Server Error")
                        }
                        await employerService.updateEmployerFromApplicationForm(
                            employer,
                            submissionResponse.submission.submission.data
                        )
                    }
                    await emailController.sendEmail(submissionResponse.submission.submission)
                } else if (submissionResponse.submission.draft === true) {
                    console.log("updating saved application for id ", application.id)
                    updateResult = await applicationService.updateApplication(
                        application.id,
                        "Draft",
                        submissionResponse.submission,
                        false
                    )
                }
                if (updateResult === 1) {
                    console.log("application record update successful for id ", application.id)
                    return res.status(200).send()
                }

                console.log("unable to update application database entry for id ", application.id)
                return res.status(500).send("Internal Server Error")
            }
        }

        return res.status(200).send()
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
