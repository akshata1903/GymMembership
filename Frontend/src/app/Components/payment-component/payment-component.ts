import { Component, signal, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserService } from '../../Services/user-service';
import { PaymentService } from '../../Services/payment-service';
import { MemberService } from '../../Services/member-service';
import { MembershipPlanService } from '../../Services/membership-plan-service';
import { PaymentModel } from '../../Models/PaymentModel';

@Component({
  selector: 'app-payment-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-component.html',
  styleUrls: ['./payment-component.css'],
})
export class PaymentComponent implements OnInit {
 payments = signal<PaymentModel[]>([]);

  members = signal<any[]>([]);
  membershipPlans = signal<any[]>([]);

  showAddForm = signal(false);
  editingPayment = signal<any | null>(null);

  newPayment: any = {};
  role: string | null = null;
  searchText: string = '';

  constructor(
    private paymentService: PaymentService,
    private memberService: MemberService,
    private planService: MembershipPlanService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.role = this.userService.getRole();
    this.loadPayments();
    this.loadMembers();
    this.loadPlans();
  }

 loadPayments(): void {
  if (this.role === 'Admin' || this.role === 'Trainer') {
    this.paymentService.getAllPayments().subscribe({
      next: res => this.payments.set(res?.Data || []),
      error: err => console.error('Error loading payments', err)
    });
  } else if (this.role === 'Member') {
    this.paymentService.getMyPayments().subscribe({
      next: res => this.payments.set(res?.Data || []),
      error: err => console.error('Error loading my payments', err)
    });
  }
}


  loadMembers(): void {
    this.memberService.getAllMembers().subscribe({
      next: res => this.members.set(res?.Data || []),
      error: err => console.error('Error loading members', err)
    });
  }

  loadPlans(): void {
    this.planService.getAllMembershipPlans().subscribe({
      next: res => this.membershipPlans.set(res?.Data || []),
      error: err => console.error('Error loading plans', err)
    });
  }

  applyFilter(): void {
    const value = this.searchText.trim();
    if (!value) {
      this.loadPayments();
      return;
    }

    const numericValue = Number(value);
    const filter = {
      MemberId: !isNaN(numericValue) ? numericValue : null,
      PaymentStatus: isNaN(numericValue) ? value : null
    };

    this.paymentService.getByFilter(filter).subscribe({
      next: res => this.payments.set(res?.Data || []),
      error: err => console.error('Error filtering payments', err)
    });
  }

  clearFilter(): void {
    this.searchText = '';
    this.loadPayments();
  }

  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
    this.editingPayment.set(null);
    this.newPayment = {};
  }

  closeForm(): void {
    this.showAddForm.set(false);
    this.editingPayment.set(null);
  }

  addPayment(form: NgForm): void {
    if (!form.valid) return;

    const paymentId = this.editingPayment() ? this.editingPayment()!.PaymentID : 0;

    this.paymentService.addOrUpdate(paymentId, this.newPayment).subscribe({
      next: () => {
        alert(this.editingPayment() ? 'Payment updated successfully' : 'Payment added successfully');
        this.loadPayments();
        this.closeForm();
      },
      error: err => console.error('Error adding/updating payment', err)
    });
  }

  editPayment(payment: any): void {
    this.editingPayment.set(payment);
    this.newPayment = { ...payment };
    this.showAddForm.set(true);
  }

  deletePayment(id: number): void {
    if (this.role !== 'Admin') return;
    if (!confirm('Delete this payment?')) return;

    this.paymentService.deletePayment(id).subscribe({
      next: () => this.loadPayments(),
      error: err => console.error('Error deleting payment', err)
    });
  }

  getMemberName(memberId: number): string {
    const member = this.members().find(x => x.MemberID === memberId);
    return member ? member.Name : '—';
  }

  getPlanName(planId?: number): string {
    if (!planId) return '—';
    const plan = this.membershipPlans().find(p => Number(p.MembershipPlanId) === Number(planId));
    return plan ? plan.PlanName : '—';
  }
}
