import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, of, tap, BehaviorSubject } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SsrDataService {
  private memoryCache = new Map<string, any>();
  private readonly ACCESS_TOKEN_KEY = 'access_token'; // 🔐 Token key
  private readonly IS_CORE_KEY = 'is_core';
  private loggedIn$ = new BehaviorSubject<boolean>(!!this.memoryCache.get(this.ACCESS_TOKEN_KEY));
  public isLoggedIn$ = this.loggedIn$.asObservable();
  private isCore$ = new BehaviorSubject<boolean>(false); // ✅ new
  public readonly coreStatus$ = this.isCore$.asObservable(); // Expose publicly
  private readonly LOGIN_SUCCESS_KEY = 'has_logged_in_once';
  private isBrowser: boolean;


  constructor(
    private http: HttpClient,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  fetch<T>(key: string, url: string, transformFn?: (data: any) => T): Observable<T> {
    const STATE_KEY = makeStateKey<T>(key);

    if (this.memoryCache.has(key)) {
      return of(this.memoryCache.get(key));
    }

    return this.http.get<T>(url).pipe(
      tap(rawData => {
        const finalData = transformFn ? transformFn(rawData) : rawData;
        this.memoryCache.set(key, finalData);
        if (isPlatformServer(this.platformId)) {
          this.state.set(STATE_KEY, finalData);
        }
      })
    );
  }

  clear(key: string): void {
    this.memoryCache.delete(key);
  }

   // ✅ New: Set access token in memory cache
  setToken(token: string): void {
    const decoded = jwtDecode<{sub: string; rol: string; exp: number}>(token);

    this.memoryCache.set(this.ACCESS_TOKEN_KEY, token);
    this.loggedIn$.next(true);

    if (this.isBrowser) {
    localStorage.setItem(this.LOGIN_SUCCESS_KEY, 'true');;
    }
    

    // ✅ Set isCore based on 'rol'
    const isCore = decoded["rol"] === 'core'; // adjust this logic as needed
    this.memoryCache.set(this.IS_CORE_KEY, isCore);
    this.isCore$.next(isCore);
    
  }

  // ✅ New: Get access token from memory cache
  getToken(): string | null {
    return this.memoryCache.get(this.ACCESS_TOKEN_KEY) || null;
  }

  isCore(): boolean {
    return this.memoryCache.get(this.IS_CORE_KEY) || false;
  }

  hasEverLoggedIn(): boolean {
    return this.isBrowser && localStorage.getItem(this.LOGIN_SUCCESS_KEY) === 'true';
  }
  
  // ✅ New: Clear access token from memory cache
  clearToken(): void {
    this.memoryCache.delete(this.ACCESS_TOKEN_KEY);
    this.loggedIn$.next(false);
    this.isCore$.next(false);
    if (this.isBrowser) {
      localStorage.removeItem(this.LOGIN_SUCCESS_KEY);;
    }
  }
}
