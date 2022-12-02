import { Observable, of } from 'rxjs';
import { tokensList, usersList } from './data-source';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  fullName: string;
  shortName: string;
  username: string;
  online: boolean;
  imageUrl: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  selfUser: User;
}

export const getUsers = (ids: number[]): Observable<User[]> => {
  console.warn('GET USERS REQUEST', ids);
  return of(
    usersList.filter(item => ids.includes(item.id))
  ).pipe(
    delay(1000)
  );
};

export const login = (): Observable<AuthData> => {
  const id = parseInt(prompt('юзер числом от 1 до 4'), 10) - 1;
  console.warn('LOGIN REQUEST', id);
  return of({
    accessToken: tokensList[id],
    refreshToken: '',
    selfUser: usersList[id]
  }).pipe(
    delay(1000)
  );
};
