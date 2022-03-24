import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface APIResponse {
  API: string
  Description: string
  Auth: string
  HTTPS: boolean
  Cors: string
  Link: string
  Category: string
}

export interface APIListResponse {
  count: number
  entries: APIResponse[]
}

export interface APICategoryListResponse {
  count: number
  categories: string[]
}

export interface APIHealthResponse {
  alive: boolean
}

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  apiUrl = "https://api.publicapis.org/";

  constructor(private httpClient: HttpClient) { }

  getEntries(params?: HttpParams) {
    return this.httpClient.get<APIListResponse>(this.apiUrl + 'entries', { params })
  }

  getRandom(params?: HttpParams) {
    return this.httpClient.get<APIListResponse>(this.apiUrl + 'random', { params });
  }

  getCategories() {
    return this.httpClient.get<APICategoryListResponse>(this.apiUrl + 'categories');
  }

  getHealth() {
    return this.httpClient.get<APIHealthResponse>(this.apiUrl + 'health');
  }
}
