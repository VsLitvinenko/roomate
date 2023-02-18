import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { catchError, Observable, throwError} from 'rxjs';
import { UsersService } from '../services';
import { extractError } from '../../shared';

export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly users: UsersService,
              private readonly toastController: ToastController) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const resRequest = this.users.isAuth ?
      req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.users.accessToken}`)
      }) : req;
    return next.handle(resRequest).pipe(
      catchError(err => {
        this.toastController.create({
          message: extractError(err),
          duration: 1500,
          position: 'top',
          color: 'danger',
        }).then(toast => toast.present());
        return throwError(err);
      })
    );
  }
}
