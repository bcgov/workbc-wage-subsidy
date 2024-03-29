/* eslint-disable import/prefer-default-export */
import { stringify } from "querystring"
import { fetchUtils } from "react-admin"

const apiUrl = process.env.REACT_APP_DATA_PROVIDER_URL || "http://localhost:8000"
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
    getCounts: (resource: any) =>
        httpClient(`${apiUrl}/${resource}/counts`, {
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({
            data: json
        })),
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
            const range = headers.get(countHeader.toLowerCase()) || "0"
            const total = range.split("/").pop() || "0"
            return {
                data: json,
                total: parseInt(total, 10)
            }
        })
    },
    getOneEmployer: (
        params: { id: any } // custom retrieval for employers to avoid GUIDs being passed in the url
    ) =>
        httpClient(`${apiUrl}/employers/getOne`, {
            method: "POST",
            body: JSON.stringify({ id: params.id }),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({
            data: json
        })),
    create: (resource: any, params: { data: any }) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({
            data: { ...params.data, id: json.recordId }
        })),
    createOrUpdate: (resource: any, params: { id: any; data: any }) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "PATCH",
            body: JSON.stringify(params.data),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({ data: json })),
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
    updateEmployer: (params: { id: any; data: any }) =>
        httpClient(`${apiUrl}/employers`, {
            method: "PUT",
            body: JSON.stringify({ ...params.data, id: params.id }),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({ data: json })),
    share: (resource: any, params: { id: any; data: any }) =>
        httpClient(`${apiUrl}/${resource}/share/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({ data: json })),
    shareMany: (resource: any, params: { ids: any[]; data: any }) =>
        Promise.all(
            params.ids.map((id: any) =>
                httpClient(`${apiUrl}/${resource}/share/${id}`, {
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
    sync: (resource: any) =>
        httpClient(`${apiUrl}/${resource}/sync`, {
            method: "PUT",
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({
            data: json
        })),
    mark: (resource: any, params: { id: any }) =>
        httpClient(`${apiUrl}/${resource}/mark/${params.id}`, {
            method: "PUT",
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({ data: json })),
    validateAddress: (params: { address: string; city: string; postal: string }) =>
        httpClient(`${apiUrl}/address/validate/`, {
            method: "POST",
            body: JSON.stringify(params),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({ data: json })),
    createLegacyClaim: (params: { formKey: string; guid: string; address: string; city: string }) =>
        httpClient(`${apiUrl}/claims/legacy/`, {
            method: "POST",
            body: JSON.stringify(params),
            headers: new Headers({
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            })
        }).then(({ json }) => ({ id: json.recordId }))
}
