import { getAllWage, updateWage } from "../controllers/wage.controller"
import * as wageService from "../services/wage.service"
import { getCatchment } from "../lib/catchment"
import createServer from "../utils/server"
import { beforeEach } from "node:test"

jest.mock("../services/wage.service")
jest.mock("../lib/catchment")

describe("getAllWage", () => {
    let req: any
    let res: any

    beforeEach(() => {
        req = {
            query: {
                sort: "id,ASC",
                filter: JSON.stringify({ name: "John Doe" }),
                page: "1",
                perPage: "10"
            },
            kauth: {
                grant: {
                    access_token: "test_access_token"
                }
            }
        }
        res = {
            set: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        }
    })

    it("returns 401 when not authorized", async () => {
        ;(getCatchment as jest.Mock).mockImplementation(() => {
            throw new Error()
        })

        await getAllWage(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })

    it("returns 200 with wages data", async () => {
        const catchment = "test_catchment"
        ;(getCatchment as jest.Mock).mockImplementation(() => catchment)
        const wages = {
            data: [{ id: 1, name: "John Doe" }],
            pagination: {
                to: 10,
                total: 100
            }
        }
        ;(wageService.getAllWage as jest.Mock).mockResolvedValue(wages)

        await getAllWage(req, res)
        expect(res.set).toHaveBeenCalledWith({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": "0 - 10 / 100"
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(wages.data)
    })

    it("returns 500 on server error", async () => {
        const catchment = "test_catchment"
        ;(getCatchment as jest.Mock).mockImplementation(() => catchment)
        ;(wageService.getAllWage as jest.Mock).mockImplementation(() => {
            throw new Error()
        })

        await getAllWage(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
    })
})

// describe("updateWage", () => {
//     let req: any
//     let res: any
//     beforeEach(() => {
//         req = {
//             kauth: {
//                 grant: {
//                     access_token: "test_access_token"
//                 }
//             },
//             body: {
//                 applicationstatus: "Completed"
//             },
//             params: {
//                 id: 1
//             }
//         }
//         res = {
//           set: jest.fn().mockReturnThis(),
//           status: jest.fn().mockReturnThis(),
//           send: jest.fn().mockReturnThis()
//       }
//     })

//     it("returns 401 when not authorized", async () => {
//         ;(getCatchment as jest.Mock).mockImplementation(() => {
//             throw new Error()
//         })

//         await updateWage(req, res)
//         expect(res.status).toHaveBeenCalledWith(401)
//         expect(res.send).toHaveBeenCalledWith("Not Authorized")
//     })

//     it("returns 200 with wages data", async () => {
//         const catchment = "test_catchment"
//         ;(getCatchment as jest.Mock).mockImplementation(() => catchment)
//         const wages = {
//             data: { id: 1, applicationstatus: "Completed" }
//         }
//         ;(wageService.updateWage as jest.Mock).mockResolvedValue(wages)

//         await updateWage(req, res)
//         expect(res.status).toHaveBeenCalledWith(200)
//         expect(res.send).toHaveBeenCalledWith({id: 1})
//     })

//     it("return 401 on Not Found or unauthorized", async () => {
//         const catchment = "test_catchment"
//         ;(getCatchment as jest.Mock).mockImplementation(() => catchment)
//         ;(wageService.updateWage as jest.Mock).mockResolvedValue(0)

//         await updateWage(req, res)
//         expect(res.status).toHaveBeenCalledWith(401)
//         expect(res.send).toHaveBeenCalledWith("Not Found or Not Authorized")
//     })

//     it("returns 500 on server error", async () => {
//         const catchment = "test_catchment"
//         ;(getCatchment as jest.Mock).mockImplementation(() => catchment)
//         ;(wageService.updateWage as jest.Mock).mockImplementation(() => {
//             throw new Error()
//         })

//         await updateWage(req, res)
//         expect(res.status).toHaveBeenCalledWith(500)
//         expect(res.send).toHaveBeenCalledWith("Server Error")
//     })
// })
