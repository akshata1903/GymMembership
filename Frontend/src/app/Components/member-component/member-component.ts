import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Member } from '../../Models/MemberModel';
import { MembershipPlanModel } from '../../Models/MembershipPlanModel';
import { TrainerModel } from '../../Models/TrainerModel';

import { MemberService } from '../../Services/member-service';
import { MembershipPlanService } from '../../Services/membership-plan-service';
import { UserService } from '../../Services/user-service';
import { TrainerService } from '../../Services/trainer-service';

@Component({
  selector: 'app-member-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-component.html',
  styleUrls: ['./member-component.css']
})
export class MemberComponent implements OnInit {

  members = signal<Member[]>([]);
  trainers = signal<TrainerModel[]>([]);
  membershipPlans = signal<MembershipPlanModel[]>([]);
  showAddForm = signal(false);
  editingMember = signal<Member | null>(null);

  newMember: Member = {} as Member;
  role: string | null = null;

  constructor(
    private memberService: MemberService,
    private membershipPlanService: MembershipPlanService,
    private trainerService: TrainerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.role = this.userService.getRole();

    if (this.role === 'Member') {
      this.loadLoggedInMemberByUser();
    } else {
      this.loadMembers();
    }

    this.loadMembershipPlans();
    this.loadTrainers();
  }

  loadMembers(): void {
    this.memberService.getAllMembers().subscribe({
      next: res => {
        const activeMembers = (res?.Data || []).filter(
          (m: Member) => m.IsActive === true
        );
        this.members.set(activeMembers);
      },
      error: err => console.error('LOAD MEMBER ERROR', err)
    });
  }

  loadLoggedInMemberByUser(): void {
    this.memberService.getMyMember().subscribe({
      next: res => this.members.set([res.Data]),
      error: err => console.error('LOAD LOGGED MEMBER ERROR', err)
    });
  }

  loadMembershipPlans(): void {
    this.membershipPlanService.getAllMembershipPlans().subscribe({
      next: res => this.membershipPlans.set(res?.Data || []),
      error: err => console.error('LOAD PLAN ERROR', err)
    });
  }

  loadTrainers(): void {
    this.trainerService.getAllTrainers().subscribe({
      next: res => {
        const activeTrainers = (res?.Data || []).filter(
          (t: TrainerModel) => t.IsActive === true
        );
        this.trainers.set(activeTrainers);
      },
      error: err => console.error('LOAD TRAINER ERROR', err)
    });
  }

  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
    this.newMember = {} as Member;
    this.editingMember.set(null);
  }

  closeForm(): void {
    this.showAddForm.set(false);
    this.editingMember.set(null);
  }

  addMember(form: NgForm): void {
    if (!form.valid) return;

    this.memberService.addMember(this.newMember).subscribe({
      next: () => {
        alert('Member added successfully');
        this.role === 'Member'
          ? this.loadLoggedInMemberByUser()
          : this.loadMembers();
        this.closeForm();
      },
      error: err => console.error('ADD MEMBER ERROR', err)
    });
  }

  editMember(member: Member): void {
    if (!member.IsActive) {
      alert('Inactive member cannot be edited');
      return;
    }
    this.editingMember.set({ ...member });
    this.showAddForm.set(false);
  }

  updateMember(form: NgForm): void {
    const member = this.editingMember();
    if (!form.valid || !member) return;

    this.memberService.updateMember(member.MemberID!, member).subscribe({
      next: () => {
        alert('Member updated successfully');
        this.role === 'Member'
          ? this.loadLoggedInMemberByUser()
          : this.loadMembers();
        this.closeForm();
      },
      error: err => console.error('UPDATE MEMBER ERROR', err)
    });
  }

  deleteMember(id: number): void {
    if (this.role !== 'Admin') {
      alert('Only Admin can delete members');
      return;
    }

    if (!confirm('Are you sure you want to delete this member?')) return;

    this.memberService.deleteMember(id).subscribe({
      next: () => {
        alert('Member deleted successfully');
        this.loadMembers();
      },
      error: err => console.error('DELETE MEMBER ERROR', err)
    });
  }

  getPlanName(planId: number): string {
    return (
      this.membershipPlans().find(p => p.MembershipPlanId === planId)?.PlanName ||
      '—'
    );
  }

  getTrainerName(trainerId?: number | null): string {
    if (!trainerId) return '—';
    return (
      this.trainers().find(t => t.TrainerID === trainerId)?.Name || '—'
    );
  }


  calculateBMIForNewMember(): void {
    if (!this.newMember.Height || !this.newMember.Weight) {
      this.newMember.BMI = undefined;
      return;
    }

    const heightMeters = this.newMember.Height * 0.3048;
    const bmi = this.newMember.Weight / (heightMeters * heightMeters);
    this.newMember.BMI = +bmi.toFixed(2);
  }

  calculateBMIForEditingMember(): void {
    const member = this.editingMember();
    if (!member || !member.Height || !member.Weight) {
      if (member) member.BMI = undefined;
      return;
    }

    const heightMeters = member.Height * 0.3048;
    const bmi = member.Weight / (heightMeters * heightMeters);
    member.BMI = +bmi.toFixed(2);
  }

    updateMemberStatusByEndDate(member: Member): Member {
    if (!member.MembershipEndDate) return member;

    const today = new Date();
    const endDate = new Date(member.MembershipEndDate);

    member.IsActive = endDate >= today;
    return member;
  }
}
