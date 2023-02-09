import { getAllWage,updateWage } from "../controllers/wage.controller";
import * as wageService from "../services/wage.service"
import { getCatchment } from "../lib/catchment"
import createServer from "../utils/server";

jest.mock("../services/wage.service");
jest.mock("../lib/catchment");

describe("getAllWage", () => {
  let req: any;
  let res: any;
  
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
    };
    res = {
      set: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });
  
  it("returns 401 when not authorized", async () => {
    (getCatchment as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    
    await getAllWage(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Not Authorized");
  });
  
  it("returns 200 with claims data", async () => {
    const catchment = "test_catchment";
    (getCatchment as jest.Mock).mockImplementation(() => catchment);
    const claims = {
      data: [
        { id: 1, name: "John Doe" }
      ],
      pagination: {
        to: 10,
        total: 100
      }
    };
    (wageService.getAllWage as jest.Mock).mockResolvedValue(claims);
    
    await getAllWage(req, res);
    expect(res.set).toHaveBeenCalledWith({
      "Access-Control-Expose-Headers": "Content-Range",
      "Content-Range": "0 - 10 / 100"
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(claims.data);
  });
  
  it("returns 500 on server error", async () => {
    const catchment = "test_catchment";
    (getCatchment as jest.Mock).mockImplementation(() => catchment);
    (wageService.getAllWage as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    
    await getAllWage(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Server Error");
  });
});


// const mockWageService = wageService as jest.Mocked<typeof wageService>

// describe('updateWage', () => {
//   let req: any;
//   let res: any;

//   beforeEach(() => {
//     req = {
//       params: { id: '1' },
//       body: { applicationStatus: 'approved' },
//       kauth: { grant: { access_token: 'access-token' } }
//     }

//     res = {
//       status: jest.fn().mockReturnValue({ send: jest.fn() }),
//       send: jest.fn()
//     }

//     mockWageService.updateWage.mockReset()
//   })

//   it('should return 200 and the id if the wage was updated', async () => {
//     mockWageService.updateWage.mockResolvedValue(1)

//     await updateWage(req, res)

//     expect(mockWageService.updateWage).toHaveBeenCalledWith('1', { wage: 10 }, 'access-token')
//     expect(res.status).toHaveBeenCalledWith(200)
//     expect(res.send).toHaveBeenCalledWith({ id: '1' })
//   })

//   it('should return 401 if the wage was not found or not authorized', async () => {
//     mockWageService.updateWage.mockResolvedValue(0)

//     await updateWage(req, res)

//     expect(mockWageService.updateWage).toHaveBeenCalledWith('1', { wage: 10 }, 'access-token')
//     expect(res.status).toHaveBeenCalledWith(401)
//     expect(res.send).toHaveBeenCalledWith('Not Found or Not Authorized')
//   })

//   it('should return 401 if there was an issue with getting the catchment', async () => {
//     req.kauth.grant.access_token = undefined

//     await updateWage(req, res)

//     expect(res.status).toHaveBeenCalledWith(401)
//     expect(res.send).toHaveBeenCalledWith('Not Authorized')
//   })

//   it('should return 500 if there was a server error', async () => {
//     mockWageService.updateWage.mockRejectedValue(new Error('Server error'))

//     await updateWage(req, res)

//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.send).toHaveBeenCalledWith('Server Error')
//   })
// })