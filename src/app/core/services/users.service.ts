import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, from, Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap} from 'rxjs/operators';
import { getUsers } from '../api';
import { AuthorizeResponse, UserInfo, LoginApiClient } from '../api-generated/api-client';

const localStorageKey = 'roomate.auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public readonly selfUser$: Observable<UserInfo>;

  private readonly authData$ = new BehaviorSubject<AuthorizeResponse>(null);
  private readonly users = new Map<number, BehaviorSubject<UserInfo>>();

  constructor(private readonly loginApi: LoginApiClient) {
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

  public async login(): Promise<void> {
    const authData = await firstValueFrom(
      this.loginApi.authorizeByEmail({
        email: 'slavik@mail.com',
        password: 'slavik-1234'
      })
    );
    authData.userInfo.imageUrl = 'https://hope.be/wp-content/uploads/2015/05/no-user-image.gif';
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
      filter(user => user !== null),
      map(user => ({
        ...user,
        imageUrl: 'https://hope.be/wp-content/uploads/2015/05/no-user-image.gif'
      }))
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
    const newUsers = await firstValueFrom(getUsers(ids));
    newUsers.forEach(user => this.users.get(user.id).next(user));
  }

  private setAuthData(authData: AuthorizeResponse): void {
    this.authData$.next(authData);
    this.users.set(
      authData.userInfo.id,
      new BehaviorSubject<UserInfo>(authData.userInfo)
    );
  }
}
