import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private readonly users: UsersService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    if (this.users.isAuth) {
      this.goToApp().then();
    }
  }

  public async login(): Promise<void> {
    await this.users.login();
    await this.goToApp();
  }

  private goToApp(): Promise<boolean> {
    return this.router.navigate(['app']);
  }

}
