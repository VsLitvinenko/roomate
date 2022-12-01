import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../modules/shared/services/users.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private readonly users: UsersService,
              private readonly router: Router) {
  }

  public canActivate(): Observable<boolean> {
    return this.users.isAuth$.pipe(
      tap(auth => {
        if (!auth) {
          this.router.navigate(['login']).then();
        }
      })
    );
  }
}
