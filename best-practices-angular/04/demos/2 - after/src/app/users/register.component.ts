import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'

import { UserRepositoryService } from '../core/user-repository.service';
import { IUser } from '../users/user.model';

@Component({
  styleUrls: ['./register.component.css'],
  templateUrl: './register.component.html'
})

export class RegisterComponent {
  registerForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  password: FormControl;
  saving:boolean=false;

  constructor(private router:Router, private userRepository:UserRepositoryService) { 

    this.firstName = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.email = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);

    this.registerForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    });
  }

  registerUser(user:IUser) {
    this.saving=true;
    this.userRepository.saveUser(user)
      .subscribe({
        complete: () => this.router.navigate(['/catalog']),
        error: ()=>this.saving=false
      });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
