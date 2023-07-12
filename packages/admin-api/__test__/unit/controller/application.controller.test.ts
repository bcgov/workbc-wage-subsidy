import express from "express"
import {
    deleteApplication,
    getAllApplications,
    updateApplication
} from "../../../src/controllers/application.controller"
import { getCatchment } from "../../../src/lib/catchment"
import * as applicationService from "../../../src/services/application.service"

jest.mock("../../../src/services/application.service")
jest.mock("../../../src/lib/catchment")

describe("getAllApplications", () => {
    let req: any
    let res: express.Response

    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: "test_access_token"
                }
            },
            query: {
                sort: "id,ASC",
                filter: '{"name": "John Doe"}',
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

    it("returns 200 with applicationss data", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)

        const applications = {
            data: [{ id: 1, name: "John Doe" }],
            pagination: {
                to: 10,
                total: 100
            }
        }
        ;(applicationService.getAllApplications as jest.Mock).mockResolvedValue(applications)

        await getAllApplications(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(applications.data)
        expect(res.set).toHaveBeenCalledWith({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${applications.pagination.to} / ${applications.pagination.total}`
        })
    })

    it("returns 401 when getCatchment throws an error", async () => {
        ;(getCatchment as jest.Mock).mockRejectedValue(new Error("Access denied"))
        await getAllApplications(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })

    it("returns 500 when an error occurs", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(applicationService.getAllApplications as jest.Mock).mockRejectedValue(new Error("Server Error"))

        await getAllApplications(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
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
                            identity_provider: "bceid"
                        }
                    }
                }
            },
            query: {},
            params: {
                id: 1
            },
            body: {
                name: "John Doe"
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
        req.kauth.grant.access_token.content = {
            identity_provider: "idir"
        }
        req.body = {
            applicationstatus: "Submitted"
        }
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(applicationService.updateApplication as jest.Mock).mockResolvedValue({ id: 1, name: "John Doe" })
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ id: req.params.id })
    })
    it("returns 401 when getCatchment throws an error", async () => {
        ;(getCatchment as jest.Mock).mockRejectedValue(new Error("Access denied"))
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })
    it("returns 404 when the item is not found and service returns a 0", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(applicationService.updateApplication as jest.Mock).mockResolvedValue(0)
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not Found or Not Authorized")
    })
    it("returns 500 when an error occurs", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(applicationService.updateApplication as jest.Mock).mockRejectedValue(new Error("Server Error"))
        await updateApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
    })
})

describe("deleteApplication", () => {
    let req: any
    let res: express.Response

    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: {
                        content: {
                            identity_provider: "idir"
                        }
                    }
                }
            },
            query: {},
            params: {
                id: 1
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
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(applicationService.deleteApplication as jest.Mock).mockResolvedValue({ id: 1 })
        await deleteApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ id: req.params.id })
    })
    it("returns 401 with Access Denied for bceid users", async () => {
        req.kauth.grant.access_token.content.identity_provider = "bceid"
        await deleteApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Access denied")
    })
    it("returns 401 when getCatchment throws an error", async () => {
        ;(getCatchment as jest.Mock).mockRejectedValue(new Error("Access denied"))
        await deleteApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })
    it("returns 404 when the item does not exist or the delete fails", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(applicationService.deleteApplication as jest.Mock).mockResolvedValue(null)
        await deleteApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not Found or Not Authorized")
    })
    it("returns 500 when an error occurs", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(applicationService.deleteApplication as jest.Mock).mockRejectedValue(new Error("Server Error"))
        await deleteApplication(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
    })
})
