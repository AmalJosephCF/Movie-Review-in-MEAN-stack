import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  AsyncValidatorFn
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.services';
import { map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [Validators.required, Validators.minLength(3)],
          [this.usernameAvailableValidator()] // ✅ async validator
        ],
        fullName: ['', [Validators.required]],
        email: [
          '',
          [Validators.required, Validators.email],
          [this.emailAvailableValidator()] // ✅ async validator
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        profilePhoto: ['']
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ✅ Custom validator for matching passwords
  passwordMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  };

  // ✅ Async validator: check username availability
  usernameAvailableValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.userService.checkUsername(control.value).pipe(
        map((res) => (res.available ? null : { usernameTaken: true })),
        catchError(() => of(null))
      );
    };
  }

  // ✅ Async validator: check email availability
  emailAvailableValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.userService.checkEmail(control.value).pipe(
        map((res) => (res.available ? null : { emailTaken: true })),
        catchError(() => of(null))
      );
    };
  }

  // ✅ Handle registration
  onSubmit() {
    if (this.registerForm.valid) {
    const { username, fullName, email, password, profilePhoto } = this.registerForm.value;

    this.userService.register({ username, fullName, email, password, profilePhoto }).subscribe({
      next: () => {
        // Automatically log in the user after registration
        this.userService.login(username, password).subscribe({
          next: (res: any) => {
            // ✅ Save token and user like in LoginComponent
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));

            alert('Registration & Login Successful ✅');

            // ✅ Redirect based on role
            if (res.user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/userlogin']);
            }
          },
          error: () => {
            alert('Registration succeeded, but login failed. Please log in manually.');
            this.router.navigate(['/login']);
          }
        });
        },
        error: (err) => {
          // backend sends { field, msg }
          if (err.error?.field && this.registerForm.get(err.error.field)) {
            this.registerForm
              .get(err.error.field)
              ?.setErrors({ serverError: err.error.msg });
          } else {
            alert('⚠️ Registration failed: ' + (err.error?.msg || 'Unknown error'));
          }
        }
      });
    }
  }
}
