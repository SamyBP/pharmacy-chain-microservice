import type { TokenDto } from "@/types/dtos"
import type { Optional } from "@/types/utils"

export interface RequestOptions {
    headers?: Optional<HeadersInit>
    query?: Optional<Record<string, any>>
    withAuth: boolean
}

export interface HttpException {
    error: string
}

export function isHttpException(error: unknown): error is HttpException {
    return (
        typeof error === 'object' &&
        error !== null && error !== undefined &&
        'error' in error
    )
}

export interface HttpClient {
    get<T>(url: string, options?: Optional<RequestOptions>): Promise<T>
    post<T, R>(url: string, payload: T, options?: Optional<RequestOptions>): Promise<R>
    put<T, R>(url: string, payload: T, options?: Optional<RequestOptions>): Promise<R>
    patch<T, R>(url: string, payload: T, options?: Optional<RequestOptions>): Promise<R>
    delete(url: string, options?: Optional<RequestOptions>): Promise<unknown>
}

const defaultRequestOptions = {headers: null, query: null, withAuth: false}

export const http: HttpClient = {
    get: <T>(url: string, options: RequestOptions = defaultRequestOptions) => _request("GET", url, null, options).then(_handleHttpErorr<T>),
    post: <T, R>(url: string, payload: T, options: RequestOptions = defaultRequestOptions) => _request("POST", url, payload, options).then(_handleHttpErorr<R>),
    put: <T, R>(url: string, payload: T, options: RequestOptions = defaultRequestOptions) => _request("PUT", url, payload, options).then(_handleHttpErorr<R>),
    patch: <T, R>(url: string, payload: T, options: RequestOptions = defaultRequestOptions) => _request("PATCH", url, payload, options).then(_handleHttpErorr<R>),
    delete: (url: string, options: RequestOptions = defaultRequestOptions) => _request("DELETE", url, null, options).then(_handleHttpErorr)
}


function _createDefaultHeaders(withAuth: boolean): HeadersInit {
    if (withAuth) {
        const json = sessionStorage.getItem('auth')

        if (!json) {
            throw { error: "no valid auth scheme available" } as HttpException
        }

        const auth: Optional<TokenDto> = JSON.parse(json)

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.token}`
        }
    }

    return {
        'Content-Type': 'application/json'
    }
}

function _createUrlWithQueryParams(url: string, query: Record<string, any>): string {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        params.append(key, String(value))
    })

    const queryString = params.toString()
    return queryString ? `${url}?${queryString}` : url
}



async function _request(method: string, url: string, body: unknown = null, options: RequestOptions) {
    const endpoint = options.query ? url : _createUrlWithQueryParams(url, options.query ?? {}) 
    const headers = options.headers ? options.headers : _createDefaultHeaders(options.withAuth)

    console.log(`making request at: ${endpoint} with headers: ${headers} and body: ${body}`)

    const requestInit: RequestInit = {
        method,
        headers
    }

    if (body) {
        requestInit.body = JSON.stringify(body)
    }

    return fetch(endpoint, requestInit)
}

async function _handleHttpErorr<R>(response: Response): Promise<R> { 
    console.log(`Recieved response: ${response}`)   
    if (response.ok) {
        return response.status !== 204 ? response.json() : (undefined as R)
    }

    if (response.status >= 500) {
        return Promise.reject({
            error: "Server error, try again later"
        } as HttpException )
    }

    if (response.status === 422) {
        const data = await response.json()
        const validationErrors: Record<string, string> = {}

        for (const issue of data.detail ?? []) {
            const field = issue.loc?.[issue.loc.length - 1]
            if (field && typeof field === 'string') {
                validationErrors[field] = issue.msg
            }
        }

        return Promise.reject({
            error: "Invalid data", validationErrors
        } as HttpException)
    }

    const data = await response.json()
    return Promise.reject({
        error: data.detail ?? `HTTP ${response.status}: ${response.statusText}`
    })
}