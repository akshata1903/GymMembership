import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../Services/user-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logincomponent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './logincomponent.html',
  styleUrls: ['./logincomponent.css']
})
export class Logincomponent {

  loginForm!: FormGroup;
  errorMessage = '';
  isLoginCompleted: boolean = false;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', Validators.required]
    });
  }

 login() {

  if (this.loginForm.invalid) {
    this.errorMessage = "Please fill all fields";
    return;
  }

  const request = {
    Email: this.loginForm.value.email,
    PasswordHash: this.loginForm.value.passwordHash,
    Role: this.loginForm.value.role,
    UserName: this.loginForm.value.userName
  };

  this.userService.login(request).subscribe({
    next: (response) => {
      console.log("Login response:", response);

      // ---- SUPPORT ANY FORMAT (Token/Data/token/data) ----
      const token =
        response?.Data?.Token ||
        response?.data?.Token ||
        response?.data?.token ||
        response?.Token ||
        response?.token;

      if (!token) {
        this.errorMessage = "Token not received from server.";
        return;
      }

      // Save token and login state
      this.userService.saveToken(token);

      // Hide login form
      this.isLoginCompleted = true;

      // Redirect by role
      const role = this.userService.getRole();

      if (role === 'Admin' || role === 'Trainer' || role === 'Member') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (error) => {
      console.error("Login failed:", error);
      this.errorMessage = error.error?.message || "Invalid username or password";
    }
  });

  }
goToRegister() {
    this.router.navigate(['/register']);
  }

}
