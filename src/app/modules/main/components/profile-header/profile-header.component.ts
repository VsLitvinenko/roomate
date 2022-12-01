import { Component } from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent {

  public readonly user$ = this.users.selfUser$;

  constructor(private readonly users: UsersService,
              private readonly router: Router) {
  }

  public async logout(): Promise<void> {
    this.users.logout();
    await this.router.navigate(['login']);
  }

}
