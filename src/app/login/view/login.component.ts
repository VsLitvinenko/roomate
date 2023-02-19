import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core';
import { Router } from '@angular/router';
import { AUTH_DATA } from '../mock-users-auth-data/auth-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private readonly users: UsersService,
              private readonly router: Router) {
  }

  async ngOnInit(): Promise<void> {
    if (this.users.isAuth) {
      await this.goToApp();
    }
    else {
      await this.login();
    }
  }

  public async login(): Promise<void> {
    await this.users.login(AUTH_DATA);
    await this.goToApp();
  }

  private goToApp(): Promise<boolean> {
    return this.router.navigate(['app']);
  }

}
