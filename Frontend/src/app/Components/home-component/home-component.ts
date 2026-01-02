import { Component } from '@angular/core';
import { Logincomponent } from "../logincomponent/logincomponent";
import { RegisterComponent } from '../register-component/register-component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [FormsModule,CommonModule,RouterModule  ],
  standalone:true,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
   showLogin = true;
  showRegister = false;
}
