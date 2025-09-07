import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.services'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  welcomeMessage = signal('Hello User from signal');
  sampleMessage = signal('sample message');

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  changeMsg() {
    this.welcomeMessage.set("The message changed");
    alert(this.welcomeMessage() + " " + this.sampleMessage());
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Call backend login API through service
      this.userService.login(username, password).subscribe({
        next: (res: any) => {
          // Save token and user data in local storage
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          // Navigate based on role
          if (res.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/userlogin']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Invalid username or password!';
          alert('Invalide Credentials');
        }
      });
    }
  }

  ngOnInit() {
    // Debugging only - remove later
    this.userService.logAllUsers();
  }
}
