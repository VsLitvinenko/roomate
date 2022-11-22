import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { getUsers, User } from '../api/users-api';

@Injectable({
  providedIn: 'root'
})
export class UsersStoreService {
  private readonly users = new Map<number, BehaviorSubject<User>>();

  constructor() {
  }

  public getUser(id: number): Observable<User> {
    let user$ = this.users.get(id);
    if (user$ === undefined) {
      user$ = new BehaviorSubject<User>(null);
      this.users.set(id, user$);
      this.loadUsersList([id]).then();
    }
    return user$.pipe(
      filter(user => user !== null)
    );
  }

  // update array of users in state by one request
  public async storeListOfUsers(ids: number[]): Promise<void> {
    const newIds = ids.filter(id => this.users.get(id) === undefined);
    newIds.forEach(
      id => this.users.set(id, new BehaviorSubject<User>(null))
    );
    await this.loadUsersList(newIds);
  }

  private async loadUsersList(ids: number[]): Promise<void> {
    const newUsers = await getUsers(ids).pipe(
      take(1)
    ).toPromise();
    newUsers.forEach(user => this.users.get(user.id).next(user));
  }
}
