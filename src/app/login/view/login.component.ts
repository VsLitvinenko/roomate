import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core';
import { Router } from '@angular/router';
import { AUTH_DATA as slavik } from '../mock-users-auth-data/auth-data';
import { AUTH_DATA as toha } from '../mock-users-auth-data/auth-data-user1';
import { AUTH_DATA as polya } from '../mock-users-auth-data/auth-data-user2';

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
    let user;
    switch (prompt('1 - славик, 2 - тоха, 3 - поля')) {
      case '1':
        user = slavik;
        break;
      case '2':
        user = toha;
        break;
      case '3':
        user = polya;
        break;
      default:
        user = slavik;
    }
    await this.users.login(user);
    await this.goToApp();
  }

  private goToApp(): Promise<boolean> {
    return this.router.navigate(['app']);
  }

}
