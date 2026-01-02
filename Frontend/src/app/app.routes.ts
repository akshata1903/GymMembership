import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home-component/home-component';
import { Logincomponent } from './Components/logincomponent/logincomponent';
import { Dashboardcomponent } from './Components/dashboardcomponent/dashboardcomponent';
import { MemberComponent } from './Components/member-component/member-component';
import { Sessioncomponent } from './Components/sessioncomponent/sessioncomponent';
import { TrainerComponent } from './Components/trainercomponent/trainercomponent';
import { PaymentComponent } from './Components/payment-component/payment-component';
import { RegisterComponent } from './Components/register-component/register-component';
import { MembershipPlancomponent } from './Components/membership-plancomponent/membership-plancomponent';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:HomeComponent},
    {path:'login',component:Logincomponent},
    {path:'register',component:RegisterComponent},
    {path:'dashboard',component:Dashboardcomponent},
    {path:'members',component:MemberComponent},
    {path:'membershipplan',component:MembershipPlancomponent},
    {path:'session',component:Sessioncomponent},
    {path:'trainer',component:TrainerComponent},
    {path:'payment',component:PaymentComponent}
];
