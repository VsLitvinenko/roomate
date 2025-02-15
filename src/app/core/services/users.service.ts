import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, from, Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap} from 'rxjs/operators';
import {
  AuthorizeResponse,
  UserInfo,
  LoginApiClient,
  UsersApiClient,
  AuthorizeRequest
} from '../api';

const localStorageKey = 'roomate.auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public readonly selfUser$: Observable<UserInfo>;

  private readonly authData$ = new BehaviorSubject<AuthorizeResponse>(null);
  private readonly users = new Map<number, BehaviorSubject<UserInfo>>();

  constructor(private readonly loginApi: LoginApiClient,
              private readonly usersApi: UsersApiClient) {
    this.selfUser$ = this.authData$.pipe(
      filter(data => data !== null),
      map(data => data.userInfo)
    );

    const storage = localStorage.getItem(localStorageKey);
    if (storage) {
      const authData: AuthorizeResponse = JSON.parse(storage);
      this.setAuthData(authData);
    }
  }

  public get isAuth$(): Observable<boolean> {
    return this.authData$.pipe(
      map(value => value !== null)
    );
  }

  public get isAuth(): boolean {
    return this.authData$.value !== null;
  }

  public get selfId(): number {
    return this.authData$.value.userInfo.id;
  }

  public get accessToken(): string {
    return this.authData$.value.accessToken;
  }

  public async login(authRequest: AuthorizeRequest): Promise<void> {
    const authData = await firstValueFrom(
      this.loginApi.authorizeByEmail(authRequest)
    );
    localStorage.setItem(localStorageKey, JSON.stringify(authData));
    this.setAuthData(authData);
  }

  public logout(): void {
    this.authData$.next(null);
    localStorage.removeItem(localStorageKey);
  }

  public getUser(id: number): Observable<UserInfo> {
    if (!this.users.has(id)) {
      this.users.set(id, new BehaviorSubject<UserInfo>(null));
      this.loadUsersList([id]).then();
    }
    return this.users.get(id).pipe(
      filter(user => user !== null)
    );
  }

  public getUsersList(ids: number[]): Observable<UserInfo[]> {
    return from(
      this.updateListOfUsers(ids)
    ).pipe(
      switchMap(() => combineLatest(ids.map(userId => this.getUser(userId))))
    );
  }

  // update array of users in state by one request
  public async updateListOfUsers(ids: number[]): Promise<void> {
    const newIds = ids.filter(id => !this.users.has(id));
    if (newIds.length) {
      newIds.forEach(id => this.users.set(id, new BehaviorSubject<UserInfo>(null)));
      await this.loadUsersList(newIds);
    }
  }

  private async loadUsersList(ids: number[]): Promise<void> {
    try {
      const newUsers = await firstValueFrom(
        this.usersApi.browseUsersInformation({ id: ids })
      );
      newUsers.forEach(user => this.users.get(user.id).next(user));
    }
    catch (e) {
      ids.forEach(id => this.users.delete(id));
    }
  }

  private setAuthData(authData: AuthorizeResponse): void {
    this.authData$.next(authData);
    this.users.set(
      authData.userInfo.id,
      new BehaviorSubject<UserInfo>(authData.userInfo)
    );
  }
}
