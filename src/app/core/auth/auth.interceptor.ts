import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../services';

export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly users: UsersService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.users.isAuth) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.users.accessToken}`)
      });
      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
