import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-pass',
  imports: [CommonModule,FormsModule],
  templateUrl: './forget-pass.html',
  styleUrl: './forget-pass.css'
})
export class ForgetPassComponent {

  email = '';
  otp = '';
  newPassword = '';
  step = 1; // 1 = email, 2 = OTP, 3 = reset password

  constructor(private authService: AuthService, private router: Router) {}

  onSendOtp() {
    this.authService.sendOtp(this.email).subscribe({
      next: () => {
        alert('OTP sent to your email');
        this.step = 2;
      },
      error: (err) => alert(err.error?.msg || 'Error sending OTP')
    });
  }

  onVerifyOtp() {
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        alert('OTP verified successfully');
        this.step = 3;
      },
      error: (err) => alert(err.error?.msg || 'Invalid OTP')
    });
  }

  onResetPassword() {
    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: () => {
        alert('Password reset successful. You can now login.');
        this.step = 1;
        this.email = this.otp = this.newPassword = '';
        this.router.navigate(['/login']);
      },
      error: (err) => alert(err.error?.msg || 'Error resetting password')
    });
  }

}
