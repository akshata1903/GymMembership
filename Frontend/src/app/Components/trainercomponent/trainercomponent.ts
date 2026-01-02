import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { TrainerService } from '../../Services/trainer-service';
import { UserService } from '../../Services/user-service';
import { TrainerModel } from '../../Models/TrainerModel';

@Component({
  selector: 'app-trainercomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainercomponent.html',
  styleUrl: './trainercomponent.css',
})
export class TrainerComponent implements OnInit {

  // ================= SIGNALS =================
  trainers = signal<TrainerModel[]>([]);
  showAddForm = signal(false);
  editingTrainer = signal<TrainerModel | null>(null);
  searchText: string = '';

  // ================= MODELS =================
  newTrainer: TrainerModel = {} as TrainerModel;
  role: string | null = null;

  // 🔹 Filter model (matches backend FilterModel)
  filterModel = {
    Name: '',
    Specialization: '',
    MinExperience: null as number | null,
    ShiftTime: ''
  };

  constructor(
    private trainerService: TrainerService,
    private userService: UserService
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.role = this.userService.getRole();

    if (this.role === 'Trainer') {
      this.loadMyTrainer();        
    } else {
      this.loadTrainers();         
    }
  }

  // ================= LOAD ALL =================
  loadTrainers(): void {
    this.trainerService.getAllTrainers().subscribe({
      next: res => {
        const allTrainers = res?.Data || [];
        const activeTrainers = allTrainers.filter(
          (t: TrainerModel) => t.IsActive === true
        );
        this.trainers.set(activeTrainers);
      },
      error: err => console.error('LOAD TRAINER ERROR', err)
    });
  }

  // ================= LOAD MY TRAINER =================
  loadMyTrainer(): void {
    this.trainerService.getMyTrainer().subscribe({
      next: res => {
        if (res?.Data) {
          this.trainers.set([res.Data]);   // single trainer
        } else {
          this.trainers.set([]);
        }
      },
      error: err => console.error('LOAD MY TRAINER ERROR', err)
    });
  }

  // ================= FILTER =================
  applyFilter(): void {
    this.trainerService.getByFilter(this.filterModel).subscribe({
      next: res => {
        const data = res?.Data || [];
        this.trainers.set(data);
      },
      error: err => console.error('FILTER TRAINER ERROR', err)
    });
  }

  clearFilter(): void {
    this.filterModel = {
      Name: '',
      Specialization: '',
      MinExperience: null,
      ShiftTime: ''
    };

    if (this.role === 'Trainer') {
      this.loadMyTrainer();
    } else {
      this.loadTrainers();
    }
  }

  // ================= ADD =================
  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
    this.newTrainer = {} as TrainerModel;
    this.editingTrainer.set(null);
  }

  closeForm(): void {
    this.showAddForm.set(false);
    this.editingTrainer.set(null);
  }

  addTrainer(form: NgForm): void {
    if (!form.valid) return;

    this.trainerService.addOrUpdate(0, this.newTrainer).subscribe({
      next: () => {
        alert('Trainer added successfully');
        this.loadTrainers();
        this.closeForm();
      },
      error: err => console.error('ADD TRAINER ERROR', err)
    });
  }

  // ================= EDIT =================
  editTrainer(trainer: TrainerModel): void {
    if (!trainer.IsActive) {
      alert('Inactive trainer cannot be edited');
      return;
    }

    this.editingTrainer.set({ ...trainer });
    this.showAddForm.set(false);
  }

  updateTrainer(form: NgForm): void {
    const trainer = this.editingTrainer();
    if (!form.valid || !trainer) return;

    this.trainerService.addOrUpdate(trainer.TrainerID!, trainer).subscribe({
      next: () => {
        alert('Trainer updated successfully');
        this.loadTrainers();
        this.closeForm();
      },
      error: err => console.error('UPDATE TRAINER ERROR', err)
    });
  }

  cancelEdit(): void {
    this.closeForm();
  }

  // ================= DELETE =================
  deleteTrainer(id: number): void {
    if (this.role !== 'Admin') {
      alert('Only Admin can delete trainers');
      return;
    }

    if (!confirm('Are you sure you want to delete this trainer?')) return;

    this.trainerService.deleteTrainer(id).subscribe({
      next: () => {
        alert('Trainer deleted successfully');
        this.loadTrainers();
      },
      error: err => console.error('DELETE TRAINER ERROR', err)
    });
  }
}
