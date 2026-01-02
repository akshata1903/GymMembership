import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SessionService } from '../../Services/session-service';
import { TrainerService } from '../../Services/trainer-service';
import { MemberService } from '../../Services/member-service';
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-sessioncomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sessioncomponent.html',
  styleUrl: './sessioncomponent.css',
})
export class Sessioncomponent implements OnInit {

  sessions = signal<any[]>([]);
  trainers = signal<any[]>([]);
  members = signal<any[]>([]);

  showAddForm = signal(false);
  editingSession = signal<any | null>(null);

  newSession: any = {};
  role: string | null = null;

  searchText: string = '';

  constructor(
    private sessionService: SessionService,
    private trainerService: TrainerService,
    private memberService: MemberService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.role = this.userService.getRole();

    this.loadDropdowns();
  }

  loadDropdowns(): void {
    this.trainerService.getAllTrainers().subscribe({
      next: res => {
        this.trainers.set(res?.Data || []);

       
        this.memberService.getAllMembers().subscribe({
          next: res2 => {
            this.members.set(res2?.Data || []);

            // after both loaded → load sessions
            this.loadSessions();
          }
        });
      }
    });
  }

  loadSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: res => this.sessions.set(res?.Data || [])
    });
  }


  getTrainerName(trainerId: number): string {
    const trainer = this.trainers().find(t => t.TrainerID === trainerId);
    return trainer ? trainer.Name : '';
  }

  // getMemberName(memberId: number): string {
  //   const member = this.members().find(m => m.MemberID === memberId);
  //   return member ? member.Name : '';
  // }


  applyFilter(): void {
    const value = this.searchText.trim();

    if (!value) {
      this.loadSessions();
      return;
    }

    const numericValue = Number(value);

    const filter = {
      TrainerId: !isNaN(numericValue) ? numericValue : null,
      MemberId: !isNaN(numericValue) ? numericValue : null,
      SessionType: isNaN(numericValue) ? value : null
    };

    this.sessionService.getSessionsByFilter(filter).subscribe({
      next: res => this.sessions.set(res?.Data || [])
    });
  }

  clearFilter(): void {
    this.searchText = '';
    this.loadSessions();
  }

 

  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
    this.editingSession.set(null);
    this.newSession = {};
  }

  closeForm(): void {
    this.showAddForm.set(false);
    this.editingSession.set(null);
  }

  addSession(form: NgForm): void {
    if (!form.valid) return;

    this.sessionService.addOrUpdate(0, this.newSession).subscribe(() => {
      alert('Session added successfully');
      this.loadSessions();
      this.closeForm();
    });
  }

  editSession(session: any): void {
    this.editingSession.set({ ...session });
    this.showAddForm.set(false);
  }

  updateSession(form: NgForm): void {
    const session = this.editingSession();
    if (!form.valid || !session) return;

    this.sessionService.addOrUpdate(session.SessionId, session).subscribe(() => {
      alert('Session updated successfully');
      this.loadSessions();
      this.closeForm();
    });
  }

  deleteSession(id: number): void {
    if (this.role !== 'Admin' && this.role !== 'Trainer') {
      alert('Not authorized');
      return;
    }

    if (!confirm('Delete this session?')) return;

    this.sessionService.deleteSession(id).subscribe(() => {
      this.loadSessions();
    });
  }
}
