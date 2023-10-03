/* eslint-disable import/prefer-default-export */
import { stringify } from "querystring"
import { fetchUtils } from "react-admin"

const apiUrl = process.env.REACT_APP_ADMIN_API_URL || "http://localhost:8002"
const countHeader = "Content-Range"
const httpClient = fetchUtils.fetchJson

export const dataProvider = {
    getList: (
        resource: any,
        params: { pagination: { page: any; perPage: any }; sort: { field: any; order: any }; filter: any }
    ) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort

        const rangeStart = (page - 1) * perPage
        const rangeEnd = page * perPage - 1
        const query = {
            sort: JSON.stringify([field, order]),
            page,
            perPage,
            range: JSON.stringify([rangeStart, rangeEnd]),
            filter: JSON.stringify(params.filter)
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`
        const options =
            countHeader === "Content-Range"
                ? {
                      // Chrome doesn't return `Content-Range` header if no `Range` is provided in the request.
                      headers: new Headers({
                          Accept: "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                          Range: `${resource}=${rangeStart}-${rangeEnd}`
                      })
                  }
                : {}

        return httpClient(url, options).then(({ headers, json }) => {
            if (typeof headers === "undefined" || !headers.has(countHeader)) {
                throw new Error(
                    `The ${countHeader} header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare ${countHeader} in the Access-Control-Expose-Headers header?`
                )
            }
            const range = headers.get(countHeader.toLowerCase()) || "0"
            const total = range.split("/").pop() || "0"
            return {
                data: json,
                total: parseInt(total, 10)
            }
        })
    },
    getCounts: (resource: any, params: { filter: any }) => {
        const query = {
            filter: JSON.stringify(params.filter)
        }
        return httpClient(`${apiUrl}/${resource}/counts?${stringify(query)}`, {
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({
            data: json
        }))
    },
    getOne: (resource: any, params: { id: any }) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({
            data: json
        })),
    getMany: (resource: any, params: { ids: any }) => {
        const query = {
            filter: JSON.stringify({ id: params.ids })
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`
        return httpClient(url, {
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({ data: json }))
    },
    getManyReference: (
        resource: any,
        params: {
            pagination: { page: any; perPage: any }
            sort: { field: any; order: any }
            filter: any
            target: any
            id: any
        }
    ) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort

        const rangeStart = (page - 1) * perPage
        const rangeEnd = page * perPage - 1

        const query = {
            sort: JSON.stringify([field, order]),
            page,
            perPage,
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id
            })
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`
        const options =
            countHeader === "Content-Range"
                ? {
                      // Chrome doesn't return `Content-Range` header if no `Range` is provided in the request.
                      headers: new Headers({
                          Accept: "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                          Range: `${resource}=${rangeStart}-${rangeEnd}`
                      })
                  }
                : {}
        return httpClient(url, options).then(({ headers, json }) => {
            if (typeof headers === "undefined" || !headers.has(countHeader)) {
                throw new Error(
                    `The ${countHeader} header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare ${countHeader} in the Access-Control-Expose-Headers header?`
                )
            }
            const range: string = headers.get(countHeader.toLowerCase()) || "0"
            const total = range.split("/").pop() || "0"
            return {
                data: json,
                total: parseInt(total, 10)
            }
        })
    },
    create: (resource: any, params: { data: any }) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id }
        })),
    update: (resource: any, params: { id: any; data: any }) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({ data: json })),
    // fallback to calling update many times
    updateMany: (resource: any, params: { ids: any[]; data: any }) =>
        Promise.all(
            params.ids.map((id: any) =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(params.data),
                    headers: new Headers({
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    })
                })
            )
        ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),
    delete: (resource: any, params: { id: any }) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "DELETE",
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "text/plain"
            })
        }).then(({ json }) => ({ data: json })),
    // fallback to calling delete many times
    deleteMany: (resource: any, params: { ids: any[] }) =>
        Promise.all(
            params.ids.map((id: any) =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: "DELETE",
                    headers: new Headers({
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "text/plain"
                    })
                })
            )
        ).then((responses) => ({
            data: responses.map(({ json }) => json.id)
        })),
    getPdf: (resource: any, params: { id: any; formType: any }) =>
        httpClient(`${apiUrl}/${resource}/pdf/${params.id}/${params.formType}`, {
            method: "GET",
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => json)
}
