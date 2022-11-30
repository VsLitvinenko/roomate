import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthData, getUsers, login, User } from '../../../api/users-api';

const localStorageKey = 'roomate.auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public readonly selfUser$: Observable<User>;

  private readonly authData$ = new BehaviorSubject<AuthData>(null);
  private readonly users = new Map<number, BehaviorSubject<User>>();

  constructor() {
    this.selfUser$ = this.authData$.pipe(
      filter(data => data !== null),
      switchMap(data => this.getUser(data.selfUser.id))
    );
  }

  public get isAuth$(): Observable<boolean> {
    return this.authData$.pipe(
      map(value => value !== null)
    );
  }

  public get isAuth(): boolean {
    return this.authData$.value !== null;
  }

  public isUserMe(id: number): boolean {
    return this.authData$.value.selfUser.id === id;
  }

  public async login(): Promise<void> {
    const storage = localStorage.getItem(localStorageKey);
    let authData: AuthData;
    if (storage) {
      authData = JSON.parse(storage);
    }
    else {
      authData = await firstValueFrom(login());
      localStorage.setItem(localStorageKey, JSON.stringify(authData));
    }
    this.authData$.next(authData);
    this.users.set(
      authData.selfUser.id,
      new BehaviorSubject<User>(authData.selfUser)
    );
  }

  public getUser(id: number): Observable<User> {
    if (!this.users.has(id)) {
      this.users.set(id, new BehaviorSubject<User>(null));
      this.loadUsersList([id]).then();
    }
    return this.users.get(id).pipe(
      filter(user => user !== null)
    );
  }

  // update array of users in state by one request
  public async updateListOfUsers(ids: number[]): Promise<void> {
    const newIds = ids.filter(id => !this.users.has(id));
    if (newIds.length) {
      newIds.forEach(id => this.users.set(id, new BehaviorSubject<User>(null)));
      await this.loadUsersList(newIds);
    }
  }

  private async loadUsersList(ids: number[]): Promise<void> {
    const newUsers = await firstValueFrom(getUsers(ids));
    newUsers.forEach(user => this.users.get(user.id).next(user));
  }
}
