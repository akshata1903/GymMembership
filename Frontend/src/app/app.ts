import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from './Services/user-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {

  isLoggedIn: boolean = false;
  role: string | null = null;

  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {

    // Listen to login status
    this.userService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Listen to role changes
    this.userService.role$.subscribe(role => {
      this.role = role;
    });

    // Load values for refresh support
    this.isLoggedIn = this.userService.isLoggedIn();
    this.role = this.userService.getRole();
  }

  logout() {
    this.userService.logout();

    this.isLoggedIn = false;
    this.role = null;

    this.router.navigate(['/home']);
  }
}
