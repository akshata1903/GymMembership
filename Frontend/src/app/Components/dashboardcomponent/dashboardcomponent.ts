import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../Services/user-service';
import { PaymentService } from '../../Services/payment-service';
import { MemberService } from '../../Services/member-service';
import { TrainerService } from '../../Services/trainer-service';
import { SessionService } from '../../Services/session-service';
import { MembershipPlanService } from '../../Services/membership-plan-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboardcomponent',
  imports: [FormsModule,CommonModule],
  standalone:true,
  templateUrl: './dashboardcomponent.html',
  styleUrl: './dashboardcomponent.css',
})
export class Dashboardcomponent implements OnInit {
  role: string | null = null;

  // Signals for data
  members = signal<any[]>([]);
  payments = signal<any[]>([]);
  sessions = signal<any[]>([]);
  trainers = signal<any[]>([]);
  plans = signal<any[]>([]);

  // Counts for cards
  memberCount = signal(0);
  paymentCount = signal(0);
  sessionCount = signal(0);
  trainerCount = signal(0);
  planCount = signal(0);

  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private memberService: MemberService,
    private trainerService: TrainerService,
    private sessionService: SessionService,
    private planService: MembershipPlanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.userService.getRole();
    this.loadData();
  }

 
  loadData(): void {
    if (!this.role) return;

    if (this.role === 'Admin') {
  
      this.loadAllMembers();
      this.loadAllPayments();
      this.loadAllSessions();
      this.loadAllTrainers();
      this.loadAllPlans();
    }

    if (this.role === 'Trainer') {
   
      this.loadTrainerSessions();
      this.loadAllMembers(); 
       this.loadAllPayments();
  
    }

    if (this.role === 'Member') {

      this.loadMyPayments();
      this.loadMySessions();
      this.loadMyMemberInfo();
      this.loadAllPlans();
    }
  }

  loadAllMembers(): void {
    this.memberService.getAllMembers().subscribe(res => {
      const data = res?.Data || [];
      this.members.set(data);
      this.memberCount.set(data.length);
    });
  }

  loadAllPayments(): void {
    this.paymentService.getAllPayments().subscribe(res => {
      const data = res?.Data || [];
      this.payments.set(data);
      this.paymentCount.set(data.length);
    });
  }

  loadAllSessions(): void {
    this.sessionService.getAllSessions().subscribe(res => {
      const data = res?.Data || [];
      this.sessions.set(data);
      this.sessionCount.set(data.length);
    });
  }

  loadAllTrainers(): void {
    this.trainerService.getAllTrainers().subscribe(res => {
      const data = res?.Data || [];
      this.trainers.set(data);
      this.trainerCount.set(data.length);
    });
  }

  loadAllPlans(): void {
    this.planService.getAllMembershipPlans().subscribe(res => {
      const data = res?.Data || [];
      this.plans.set(data);
      this.planCount.set(data.length);
    });
  }

  loadTrainerSessions(): void {
    this.sessionService.getAllSessions().subscribe(res => {
      const data = res?.Data || [];
      this.sessions.set(data);
      this.sessionCount.set(data.length);
    });
  }


  loadMyPayments(): void {
    this.paymentService.getMyPayments().subscribe(res => {
      const data = res?.Data || [];
      this.payments.set(data);
      this.paymentCount.set(data.length);
    });
  }

  loadMySessions(): void {
    this.sessionService.getAllSessions().subscribe(res => {
      const data = res?.Data || [];
      this.sessions.set(data);
      this.sessionCount.set(data.length);
    });
  }

  loadMyMemberInfo(): void {
    this.memberService.getMyMember().subscribe(res => {
      const data = res?.Data ? [res.Data] : [];
      this.members.set(data);
      this.memberCount.set(data.length);
    });
  }

  navigateTo(entity: 'members' | 'payment' | 'session' | 'trainer' | 'membershipplan') {
    this.router.navigate([`/${entity}`]);
  }

}
