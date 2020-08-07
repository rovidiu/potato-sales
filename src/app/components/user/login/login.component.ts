import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService, MessageService } from '../../../services';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl('test1', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]),
      'password': new FormControl('123456', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.messageService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.loginUser({
      id: 0,
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    })
      .subscribe(
        data => {
          this.loading = false;
          this.router.navigate([environment.loginRedirectUrl]);
        },
        error => {
          this.messageService.error(error.error.message);
          this.loading = false;
        });
  }

}
