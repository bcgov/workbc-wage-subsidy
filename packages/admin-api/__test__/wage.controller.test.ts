import express from "express"
import { getAllWage, updateWage, deleteWage } from "../src/controllers/wage.controller"
import { getCatchment } from "../src/lib/catchment"
import * as wageService from "../src/services/wage.service"

jest.mock("../src/services/wage.service")
jest.mock("../src/lib/catchment")

describe("getAllWage", () => {
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

    it("returns 200 with wages data", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)

        const wages = {
            data: [{ id: 1, name: "John Doe" }],
            pagination: {
                to: 10,
                total: 100
            }
        }
        ;(wageService.getAllWage as jest.Mock).mockResolvedValue(wages)

        await getAllWage(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(wages.data)
        expect(res.set).toHaveBeenCalledWith({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${wages.pagination.to} / ${wages.pagination.total}`
        })
    })

    it("returns 401 when getCatchment throws an error", async () => {
        ;(getCatchment as jest.Mock).mockRejectedValue(new Error("Access denied"))
        await getAllWage(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })

    it("returns 500 when an error occurs", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(wageService.getAllWage as jest.Mock).mockRejectedValue(new Error("Server Error"))

        await getAllWage(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
    })
})

describe("updateWage", () => {
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
    it("returns 200 with wages data", async () => {
        req.kauth.grant.access_token.content = {
            identity_provider: "idir"
        }
        req.body = {
            applicationstatus: "Submitted"
        }
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(wageService.updateWage as jest.Mock).mockResolvedValue({ id: 1, name: "John Doe" })
        await updateWage(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ id: req.params.id })
    })
    it("returns 401 when getCatchment throws an error", async () => {
        ;(getCatchment as jest.Mock).mockRejectedValue(new Error("Access denied"))
        await updateWage(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })
    it("returns 404 when the item is not found and service returns a 0", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(wageService.updateWage as jest.Mock).mockResolvedValue(0)
        await updateWage(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not Found or Not Authorized")
    })
    it("returns 500 when an error occurs", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(wageService.updateWage as jest.Mock).mockRejectedValue(new Error("Server Error"))
        await updateWage(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
    })
})

describe("deleteWage", () => {
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
    it("returns 200 with wages data", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(wageService.deleteWage as jest.Mock).mockResolvedValue({ id: 1 })
        await deleteWage(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ id: req.params.id })
    })
    it("returns 401 with Access Denied for bceid users", async () => {
        req.kauth.grant.access_token.content.identity_provider = "bceid"
        await deleteWage(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Access denied")
    })
    it("returns 401 when getCatchment throws an error", async () => {
        ;(getCatchment as jest.Mock).mockRejectedValue(new Error("Access denied"))
        await deleteWage(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })
    it("returns 404 when the item does not exist or the delete fails", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(wageService.deleteWage as jest.Mock).mockResolvedValue(null)
        await deleteWage(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not Found or Not Authorized")
    })
    it("returns 500 when an error occurs", async () => {
        const catchment = ["test_catchment"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(wageService.deleteWage as jest.Mock).mockRejectedValue(new Error("Server Error"))
        await deleteWage(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
    })
})
