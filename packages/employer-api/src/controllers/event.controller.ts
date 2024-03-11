/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as applicationService from "../services/application.service"
import * as claimService from "../services/claim.service"
import * as employerService from "../services/employer.service"
import * as formService from "../services/form.service"
import * as emailController from "./email.controller"
import * as geocoderService from "../services/geocoder.service"
import { getCHEFSToken } from "../services/common.service"

export const submission = async (req: express.Request, res: express.Response) => {
    try {
        const { formType } = req.params
        const passedKey = req.headers["x-api-key"]
        if (!formType) {
            return res.status(400).send("Form type parameter required")
        }
        console.log(
            `[event.controller] submission event received for form type ${formType} with submission id ${req.body.submissionId}`
        )

        let formPass
        if (formType === "HaveEmployeeForm") {
            formPass = process.env.HAVE_EMPLOYEE_PASS
        } else if (formType === "NeedEmployeeForm") {
            formPass = process.env.NEED_EMPLOYEE_PASS
        } else if (formType === "ClaimForm") {
            formPass = process.env.CLAIM_FORM_PASS
        } else if (formType === "ServiceProviderClaimForm") {
            formPass = process.env.SP_CLAIM_FORM_PASS
        }

        if (!formPass) {
            return res.status(400).send("Invalid form type parameter provided")
        }
        if (!passedKey || passedKey !== formPass) {
            return res.status(401).send("Invalid api key")
        }

        const submissionResponse = await formService.getSubmission(req.body.formId, formPass, req.body.submissionId)
        const submission = submissionResponse?.submission?.submission
        if (!submission) {
            console.log(
                `[event.controller] failed to obtain submission data for submission id ${req.body.submissionId}`
            )
            return res.status(500).send("Internal Server Error")
        }

        // Claim Form events //
        if (formType === "ClaimForm") {
            let claim = await claimService.getClaimBySubmissionID(req.body.submissionId)
            if (submissionResponse.submission.draft === true) {
                if (claim?.status !== "Draft") {
                    console.log(
                        `[event.controller] claim form full-submission events shouldn't occur - aborting for submission id ${req.body.submissionId}`
                    )
                    return res.status(500).send("Internal Server Error")
                }
                console.log(
                    `[event.controller] updating saved claim for claim id ${claim.id} and submission id ${req.body.submissionId}`
                )
                const updateResult = await claimService.updateClaim(
                    claim.id,
                    "Draft",
                    submissionResponse.submission,
                    false
                )
                if (updateResult === 1) {
                    console.log(
                        `[event.controller] claim record update successful for claim id ${claim.id} and submission id ${req.body.submissionId}`
                    )
                    return res.status(200).send()
                }
                console.log(
                    `[event.controller] unable to update claim database entry for claim id ${claim.id} and submission id ${req.body.submissionId}`
                )
                return res.status(500).send("Internal Server Error")
            }
            // Create service provider claim form if one does not already exist.
            if (!claim?.service_provider_form_submission_id || !claim?.service_provider_form_internal_id) {
                const serviceProviderInternalID = `SPx${submission.data.internalId}` // create a new internal id for the SP form

                // Create a new form draft //
                const token = await getCHEFSToken()
                const createDraftResult = await formService.createLoginProtectedDraft(
                    { token },
                    process.env.SP_CLAIM_FORM_ID as string,
                    process.env.SP_CLAIM_FORM_VERSION_ID as string,
                    serviceProviderInternalID,
                    submission.data,
                    claim.catchmentno
                )

                if (createDraftResult?.id && createDraftResult.submission) {
                    console.log(`[event.controller] new SP claim form draft created with id ${createDraftResult.id}`)
                    const addResult = await claimService.addServiceProviderClaim(
                        submissionResponse,
                        serviceProviderInternalID,
                        createDraftResult.id
                    )
                    if (addResult === 1) {
                        console.log(
                            `[event.controller] claim record update successful for submission id ${req.body.submissionId}`
                        )
                        // Get the newly added record
                        claim = await claimService.getServiceProviderClaimByInternalId(serviceProviderInternalID)
                        if (claim === null) {
                            console.log(
                                `[event.controller] error retrieving new claim for submission id ${req.body.submissionId}`
                            )
                            return res.status(500).send("Internal Server Error")
                        }
                    } else {
                        console.log(
                            `[event.controller] unable to update claim database entry for submission id ${req.body.submissionId}`
                        )
                        return res.status(500).send("Internal Server Error")
                    }
                } else {
                    console.log(
                        `[event.controller] unable to create new service provider claim form for submission id ${req.body.submissionId} - this shouldn't happen!`
                    )
                    return res.status(500).send("Internal Server Error")
                }
            }
            // Send notifications to clients with Claims notifications enabled
            await emailController
                .sendEmail({
                    // email controller expects the data to be wrapped in a data object
                    data: {
                        catchmentNo: claim.catchmentno,
                        applicationType: "Claims"
                    }
                })
                .then(() => {
                    console.log(
                        `[event.controller] successfully sent notifications for submission id ${req.body.submissionId}`
                    )
                })
                .catch((e) => {
                    console.log(
                        `[event.controller] error sending notifications for submission id ${req.body.submissionId} - Error:`,
                        e
                    )
                    return res.status(500).send("Internal Server Error")
                })
            return res.status(200).send()
        }

        // Service Provider Claim Form draft submission events - triggered on calculator approval //
        if (formType === "ServiceProviderClaimForm") {
            if (submission.data.customEvent !== true) {
                console.log(`[event.controller] not a custom event - ignoring submission id ${req.body.submissionId}`)
                return res.status(200).send("not a custom event - ignoring")
            }
            if (submissionResponse.submission.draft !== true) {
                console.log(
                    `[event.controller] service provider claim form full-submission events should not occur - aborting for submission id ${req.body.submissionId}`
                )
                return res.status(400).send("service provider claim form full-submission events should not occur")
            }
            // Update the claim form entry //
            const updateResult = await claimService.updateServiceProviderClaim(submissionResponse)
            if (updateResult === 1) {
                console.log(
                    `[event.controller] claim record update successful for submission id ${req.body.submissionId}`
                )
                return res.status(200).send()
            }

            console.log(
                `[event.controller] unable to update claim database entry for submission id ${req.body.submissionId}`
            )
            return res.status(500).send("Internal Server Error")
        }

        // Application form events //
        if (formType === "HaveEmployeeForm" || formType === "NeedEmployeeForm") {
            const application = await applicationService.getApplicationBySubmissionID(req.body.submissionId)
            if (!application) {
                console.log(
                    `[event.controller] application record not found - aborting for submission id ${req.body.submissionId}`
                )
                return res.status(404).send()
            }
            if (application?.status === "Draft") {
                let updateResult
                if (submissionResponse.submission.draft === false) {
                    console.log(
                        `[event.controller] updating submitted application for application id ${application.id} and submission id ${req.body.submissionId}`
                    )
                    // Route the catchment & storefront for the submitted application //
                    // Use the workplace address if provided, otherwise use the business address //
                    let address
                    let city
                    let province
                    const workplaceContainer = submission?.data?.container
                    if (
                        workplaceContainer?.addressAlt &&
                        workplaceContainer.cityAlt &&
                        workplaceContainer.provinceAlt
                    ) {
                        address = workplaceContainer.addressAlt
                        city = workplaceContainer.cityAlt
                        province = workplaceContainer.provinceAlt
                    } else if (
                        submission.data.businessAddress &&
                        submission.data.businessCity &&
                        submission.data.businessProvince
                    ) {
                        address = submission.data.businessAddress
                        city = submission.data.businessCity
                        province = submission.data.businessProvince
                    }
                    console.log(
                        `[event.controller] address for submission id ${req.body.submissionId} - Address: ${address}, City: ${city}, Province: ${province}`
                    )
                    const { Score, Catchment, Storefront } = await geocoderService.geocodeAddress(
                        address,
                        city,
                        province
                    )
                    console.log(
                        `[event.controller] address validation result for submission id ${req.body.submissionId} - Score: ${Score}, Catchment: ${Catchment}, Storefront: ${Storefront}`
                    )
                    if (Score && Catchment && Storefront) {
                        if (Score >= 95) {
                            const newDataObj = Object.assign(submissionResponse.submission.submission.data, {
                                catchmentNo: Catchment,
                                storefrontId: Storefront,
                                catchmentNoStoreFront: `${Catchment}-${Storefront}`,
                                matchedToCentre: `${Catchment}-${Storefront}`
                            })
                            submissionResponse.submission.submission.data = newDataObj // update the object used for updating the application record
                        } else {
                            console.log(
                                `[event.controller] insufficient address validation score for application submission id ${application.form_submission_id} - this shouldn't happen!`
                            )
                        }
                    } else {
                        console.log(
                            `[event.controller] insufficient results returned from address validation for submission id ${application.form_submission_id} - this shouldn't happen!`
                        )
                    }

                    // Update the application //
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

                    // Update the catchment of the form in CHEFS //
                    if (Catchment) {
                        await formService.updateSubmissionCatchment(
                            req.body.submissionId,
                            submissionResponse.submission,
                            Catchment
                        )
                    }

                    // Send notification(s) //
                    await emailController
                        .sendEmail(submissionResponse.submission.submission)
                        .then(() => {
                            console.log(
                                `[event.controller] successfully sent notifications for submission id ${req.body.submissionId}`
                            )
                        })
                        .catch((e) => {
                            console.log(
                                `[event.controller] error sending notifications for submission id ${req.body.submissionId} - Error:`,
                                e
                            )
                            return res.status(500).send("Internal Server Error")
                        })
                } else if (submissionResponse.submission.draft === true) {
                    console.log(
                        `[event.controller] updating saved application for application id ${application.id} and submission id ${req.body.submissionId}`
                    )
                    updateResult = await applicationService.updateApplication(
                        application.id,
                        "Draft",
                        submissionResponse.submission,
                        false
                    )
                }
                if (updateResult === 1) {
                    console.log(
                        `[event.controller] application record update successful for application id ${application.id} and submission id ${req.body.submissionId}`
                    )
                    return res.status(200).send()
                }

                console.log(
                    `[event.controller] unable to update application database entry for application id ${application.id} and submission id ${req.body.submissionId}`
                )
                return res.status(500).send("Internal Server Error")
            }
            console.log(
                `[event.controller] application record is not in Draft status - aborting for submission id ${req.body.submissionId}`
            )
            return res.status(500).send("Internal Server Error")
        }

        return res.status(200).send()
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
