import type { AchievementItem } from "../models/Achievement";
import type { AchievementCountResponse } from "../models/AchievementCountResponse";
import type { ArchipelagoItem } from "../models/api/Archipelago";
import type { FriendItem } from "../models/api/Friend";
import type { GameItem } from "../models/api/Game";
import type { GameJamItem } from "../models/api/Gamejam";
import type { GoalCategoryItem } from "../models/api/Goal";
import type { NewsItem } from "../models/api/News";
import type { OCInfo } from "../models/api/OC";
import type { ProjectCommitsItem, ProjectItem } from "../models/api/Project";
import type { SheepItem } from "../models/api/Sheep";

export class Api {
    public getQuote(nsfw: number) {
        return this.get<string>(`/info/quote/${nsfw}`);
    }

    public getGamejams(nsfw: number) {
        return this.get<GameJamItem[]>(`/info/gamejams/${nsfw}`);
    }

    public getFriends() {
        return this.get<FriendItem[]>("/info/lifeline");
    }

    public getNews(nsfw: number) {
        return this.get<NewsItem[]>(`/info/news/${nsfw}`);
    }

    public getSheep() {
        return this.get<SheepItem[]>("/info/sheep");
    }

    public getProjects(nsfw: number) {
        return this.get<ProjectItem[]>(`/info/projects/${nsfw}`);
    }

    public getProjectsCommits(nsfw: number) {
        return this.get<{ [name: string]: ProjectCommitsItem }>(`/info/projects/${nsfw}/commits`);
    }

    public getGames() {
        return this.get<{ [id: string] : GameItem[]; }>("/info/games");
    }

    public getAchievementCount(ids: string[]) {
        return this.post<AchievementCountResponse>("/info/achievements/count", { ids });
    }

    public getAchievementInfo(ids: string[]) {
        return this.post<AchievementItem[]>("/info/achievements/get", { ids });
    }

    public getOCs() {
        return this.get<OCInfo>("/info/ocs");
    }

    public getGoals() {
        return this.get<{ [id: string]: GoalCategoryItem }>("/info/goals");
    }

    public getArchipelagos() {
        return this.get<ArchipelagoItem[]>("/info/archipelagos");
    }

    public validatePath(id: string, hash: string) {
        return this.get(`/info/lifeline/static/${id}/${hash}`);
    }
    
    private unlockAchievementInternal(key: string)
    {
        this.achievements.push(key);
        localStorage.setItem("achievements", JSON.stringify(this.achievements));
    }

    public unlockAchievement(key: string)
    {
        if (!this.achievements.includes(key))
        {
            if (this.isLoggedIn()) {
                this.put(`/achievement/${key}`, {})
                    .then(_ => this.unlockAchievementInternal(key))
                    .catch(e => console.error(`Failed to unlock ${key}: ${e}`))
            } else {
                this.unlockAchievementInternal(key);
            }
        }
    }

    private achievements: string[] = JSON.parse(localStorage.getItem("achievements") ?? "[]");
    private token: string | null = localStorage.getItem("token");
    private baseUrl = this.getEndpoint() + "/api"
    private displayName: string | null = localStorage.getItem("displayName");

    public isLoggedIn(): boolean {
        return this.token !== null;
    }

    public getDisplayName() {
        return this.displayName;
    }

    private getEndpoint() {
        return window.location.origin.startsWith("http://localhost")
            ? `http://localhost:5081` // Used for local debugging
            : ""
    }

    /**
     * Set the authorization token
     * @param token The new token
     */
    public setToken(token: string, displayName: string, achievements: string[], nsfwPreference: number | null) {
        this.token = token
        this.displayName = displayName;
        localStorage.setItem("token", token);
        localStorage.setItem("displayName", displayName);
        localStorage.setItem("achievements", JSON.stringify(achievements));
    }

    public unsetToken() {
        this.token = null;
        this.displayName = null;
        localStorage.removeItem("token");
        localStorage.removeItem("displayName");
    }

    // Thanks Indra for writing all that good code for Katsis intranet

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

        if (this.token !== null) {
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