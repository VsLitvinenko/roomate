import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { getUsers, User } from '../../../api/users-api';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly users = new Map<number, BehaviorSubject<User>>();

  constructor() { }

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
