import type { FriendItem } from "../models/api/Friend";
import type { GameJamItem } from "../models/api/Gamejam";
import type { NewsItem } from "../models/api/News";

export class Api {
    public getQuote(nsfw: number) {
        return this.get<string>(`/quote/${nsfw}`);
    }

    public getGamejams(nsfw: number) {
        return this.get<GameJamItem[]>(`/gamejams/${nsfw}`);
    }

    public getFriends() {
        return this.get<FriendItem[]>("/friends");
    }

    public getNews(nsfw: number) {
        return this.get<NewsItem[]>(`/news/${nsfw}`);
    }

    // Thanks Indra for writing all that good code for Katsis intranet

    private token?: string
    private baseUrl = this.getEndpoint() + "/api/info"

    private getEndpoint() {
        return window.location.origin.startsWith("http://localhost")
            ? `http://localhost:5081` // Used for local debugging
            : ""
    }

    /**
     * Set the authorization token
     * @param token The new token
     */
    public setToken(token: string) {
        this.token = token
    }

    /**
     * Send a GET request to the path and return the response
     * @param path The endpoint path
     * @returns The response
     */
    public async get<T>(path: string) {
        return this.fetch(path, "GET") as T
    }

    /**
     * Send a POST request to the path and return the response
     * @param path The endpoint path
     * @returns The response
     */
    public async post<T>(path: string, data: unknown) {
        return this.fetch(path, "POST", data) as T
    }

    /**
     * Send a PUT request to the path and return the response
     * @param path The endpoint path
     * @returns The response
     */
    public async put<T>(path: string, data: unknown) {
        return this.fetch(path, "PUT", data) as T
    }

    /**
     * Send a PATCH request to the path and return the response
     * @param path The endpoint path
     * @returns The response
     */
    public async patch<T>(path: string, data: unknown) {
        return this.fetch(path, "PATCH", data) as T
    }

    /**
     * Send a DELETE request to the path and return the response
     * @param path The endpoint path
     * @returns The response
     */
    public async delete<T>(path: string) {
        return this.fetch(path, "DELETE") as T
    }

    /**
     * Send a request to the path and return the response
     * @param path The path
     * @param method The request method
     * @param data The optional request body
     * @returns The deserialized response body or null if there's no content
     */
    private async fetch(path: string, method: string, data?: unknown) {
        const options: RequestInit = { method }
        const headers = new Headers()

        if (data) {
            if (data instanceof FormData) {
                options.body = data
            } else {
                options.body = JSON.stringify(data)
                headers.append("Content-Type", "application/json")
            }
        }

        if (this.token) {
            headers.append("Authorization", "Bearer " + this.token)
        }

        options.headers = headers
        const response = await fetch(this.baseUrl + path, options)

        if (!response.ok) {
            throw new FetchError(`Failed to fetch ${path}: ${response.statusText}`, response.status)
        }

        return response.status != 204 ? response.json() : null
    }
    
}
class FetchError extends Error {
    /**
     * The response code
     */
    code: number

    constructor(message: string, code: number) {
        super(message)
        this.code = code
    }
}