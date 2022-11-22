import { Observable, of } from 'rxjs';
import { usersList } from './data-source';
import { debounceTime } from 'rxjs/operators';

export interface User {
  id: number;
  fullName: string;
  shortName: string;
  username: string;
  online: boolean;
  imageUrl: string;
}

export const getUsers = (ids: number[]): Observable<User[]> => of(
    usersList.filter(item => ids.includes(item.id))
  ).pipe(
    debounceTime(1000)
  );
