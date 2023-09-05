import express from "express"
import {
    getAllApplications,
    updateApplication,
    getOneApplication
} from "../../../src/controllers/application.controller"
import { getCatchments } from "../../../src/lib/catchment"
import { updateApplicationWithSideEffects } from "../../../src/lib/transactions"
import * as applicationService from "../../../src/services/application.service"

jest.mock("../../../src/services/application.service")
jest.mock("../../../src/lib/catchment")
jest.mock("../../../src/lib/transactions")

describe("getAllApplications", () => {
    let req: any
    let res: express.Response

    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: {
                        content: {
                            bceid_user_guid: "bceid_guid",
                            idir_user_guid: undefined,
                            identity_provider: "bceid"
                        }
                    }
                }
            },
            query: {
                filter: '{"catchmentno": 1}',
                page: "1",
                perPage: "10"
            }
        }
        res = express.response
        res.status = jest.fn().mockReturnValue(res)
        res.send = jest.fn()
        res.set = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("returns 200 with applications data", async () => {
        const catchments = [1]
        const applications = {
            data: [{ id: "1", catchmentno: 1 }],
            pagination: {
                to: 10,
                total: 100
            }
        }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getAllApplications as jest.Mock).mockResolvedValue(applications)
        await getAllApplications(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(applications.data)
        expect(res.set).toHaveBeenCalledWith({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${applications.pagination.to} / ${applications.pagination.total}`
        })
    })

    it("returns 200 with empty applications data when catchmentno = -1", async () => {
        req.query = {
            filter: '{ "catchmentno": -1 }',
            page: "1",
            perPage: "10"
        }
        const catchments = [1]
        const applications = {
            data: [{}],
            pagination: {
                to: 10,
                total: 100
            }
        }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getAllApplications as jest.Mock).mockResolvedValue(applications)
        await getAllApplications(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(applications.data)
        expect(res.set).toHaveBeenCalledWith({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${applications.pagination.to} / ${applications.pagination.total}`
        })
    })

    it("returns 401 when username undefined", async () => {
        req.kauth.grant.access_token.content = {
            bceid_user_guid: undefined,
            idir_user_guid: undefined
        }
        await getAllApplications(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })

    it("returns 403 when no catchment filter provided", async () => {
        req.query = {
            filter: "{}",
            page: "1",
            perPage: "10"
        }
        const catchments = [1]
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        await getAllApplications(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 403 when no catchments obtained", async () => {
        const catchments: never[] = []
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        await getAllApplications(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 403 when user lacks catchment permission", async () => {
        const catchments = [2]
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        await getAllApplications(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 500 when an error occurs", async () => {
        ;(getCatchments as jest.Mock).mockRejectedValue(new Error("Server Error"))
        await getAllApplications(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Internal Server Error")
    })
})

describe("getOneApplication", () => {
    let req: any
    let res: express.Response

    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: {
                        content: {
                            bceid_user_guid: "bceid_guid",
                            idir_user_guid: undefined,
                            identity_provider: "bceid"
                        }
                    }
                }
            },
            params: {
                id: "1"
            }
        }
        res = express.response
        res.status = jest.fn().mockReturnValue(res)
        res.send = jest.fn()
        res.set = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("returns 200 with application when bceid username defined", async () => {
        const catchments = [1]
        const application = { id: "1", catchmentno: 1 }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await getOneApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(application)
    })

    it("returns 401 when username undefined", async () => {
        req.kauth.grant.access_token.content = {
            bceid_user_guid: undefined,
            idir_user_guid: undefined
        }
        await getOneApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })

    it("returns 403 when no catchments obtained", async () => {
        const catchments: never[] = []
        const application = { id: "1", catchmentno: 1 }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await getOneApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 403 when user lacks catchment permission", async () => {
        const catchments = [2]
        const application = { id: "1", catchmentno: 1 }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await getOneApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 404 when application not found", async () => {
        const catchments = [1]
        const application = null
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await getOneApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not Found")
    })

    it("returns 500 when an error occurs", async () => {
        const catchment = [1]
        ;(getCatchments as jest.Mock).mockResolvedValue(catchment)
        ;(applicationService.getApplicationByID as jest.Mock).mockRejectedValue(new Error("test_error"))
        await getOneApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Internal Server Error")
    })
})

describe("updateApplication", () => {
    let req: any
    let res: express.Response

    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: {
                        content: {
                            bceid_user_guid: "bceid_guid",
                            idir_user_guid: undefined,
                            identity_provider: "bceid"
                        }
                    }
                }
            },
            query: {},
            params: {
                id: "1"
            },
            body: {
                status: "Completed"
            }
        }
        res = express.response
        res.status = jest.fn().mockReturnValue(res)
        res.send = jest.fn()
        res.set = jest.fn()
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    it("returns 200 with application id when bceid username defined", async () => {
        const catchments = [1]
        const application = { id: "1", catchmentno: 1, status: "Processing" }
        const applicationID = { id: "1" }
        const numUpdated = 1
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        ;(updateApplicationWithSideEffects as jest.Mock).mockResolvedValue(numUpdated)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(applicationID)
    })
    it("returns 200 with application id when idir user updates catchment", async () => {
        req.kauth.grant.access_token.content = {
            bceid_user_guid: undefined,
            idir_user_guid: "idir_guid",
            identity_provider: "idir"
        }
        req.body.catchmentNo = 2
        const catchments = [1, 2]
        const application = { id: "1", catchmentno: 1, status: "Processing" }
        const applicationID = { id: "1" }
        const numUpdated = 1
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        ;(updateApplicationWithSideEffects as jest.Mock).mockResolvedValue(numUpdated)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(applicationID)
    })
    it("returns 200 when no records are updated but no error occurs", async () => {
        const catchments = [1]
        const application = { id: "1", catchmentno: 1, status: "Processing" }
        const applicationID = { id: "1" }
        const numUpdated = 0
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        ;(updateApplicationWithSideEffects as jest.Mock).mockResolvedValue(numUpdated)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(applicationID)
    })
    it("returns 401 when username undefined", async () => {
        req.kauth.grant.access_token.content = {
            bceid_user_guid: undefined,
            idir_user_guid: undefined
        }
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })
    it("returns 403 when no catchments obtained", async () => {
        const catchments: never[] = []
        const application = { id: "1", catchmentno: 1, status: "Processing" }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
    it("returns 403 when user lacks catchment permission", async () => {
        const catchments = [2]
        const application = { id: "1", catchmentno: 1, status: "Processing" }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
    it("returns 403 when bceid user attempts to update catchment", async () => {
        req.body.catchmentNo = 2
        const catchments = [1, 2]
        const application = { id: "1", catchmentno: 1, status: "Processing" }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
    it("returns 403 when idir user attempts to set nonexistent catchment", async () => {
        req.kauth.grant.access_token.content = {
            bceid_user_guid: undefined,
            idir_user_guid: "idir_guid",
            identity_provider: "idir"
        }
        req.body.catchmentNo = 2
        const catchments = [1]
        const application = { id: "1", catchmentno: 1, status: "Processing" }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
    it("returns 404 when the item is not found", async () => {
        const catchments = [1]
        const application = null
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(applicationService.getApplicationByID as jest.Mock).mockResolvedValue(application)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not Found")
    })
    it("returns 500 when an error occurs", async () => {
        ;(applicationService.getApplicationByID as jest.Mock).mockRejectedValue(new Error("Server Error"))
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Internal Server Error")
    })
})
