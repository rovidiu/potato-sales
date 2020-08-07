import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../../services';
import { User } from '../../../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {
    this.userService.user.subscribe(x => this.user = x);
  }

  ngOnInit() {

  }

  /**
   * logout a user from the system
   */
  logout() {
    this.userService.logout();
  }
}
