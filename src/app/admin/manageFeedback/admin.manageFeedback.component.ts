import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminTopbarComponent } from '../admin_navigation/admin.admin_navigation.component';
import { SsrDataService } from '../../core/ssr-data.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

@Component({
  selector: 'app-feedback-manager',
  standalone: true,
  imports: [CommonModule, FormsModule,AdminTopbarComponent],
  templateUrl: './manageFeedback.component.html',
  styleUrls: ['./manageFeedback.component.css']
})
export class FeedbackManagerComponent implements OnInit {
feedbacks: { id: number, message: string }[] = [];
  adminPassword = 'quantum@admin';
  deleteIndex: number | null = null;
  showPasswordPrompt = false;
  enteredPassword = '';
  errorMsg = '';
  accessToken = '';
  private url = environment.apiUrl; // Use environment variable for API URL

  constructor(private http: HttpClient, private ssrData:SsrDataService, private router:Router) {}

  ngOnInit() {
    this.loadFeedbacks();
    const token = this.ssrData.getToken();
    if (!token) {
    this.http.post<{ access_token: string }>(`${this.url}/refresh`, {}, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.accessToken = res.access_token;
          this.ssrData.setToken(this.accessToken)
        },
        error: (err) => {
          this.router.navigate(['/login']);
        }
      });
    return;
    }


  }

loadFeedbacks() {
  this.http.get<{ messages: { id: number; message: string }[] }>(`${this.url}/feedback/messages`)
    .subscribe({
      next: (response) => {
        this.feedbacks = response.messages;
      },
      error: () => {
        this.feedbacks = [];
      }
    });
}


  confirmDelete(index: number) {
    this.deleteIndex = index;
    this.enteredPassword = '';
    this.errorMsg = '';
    this.showPasswordPrompt = true;
  }

  cancelDelete() {
    this.showPasswordPrompt = false;
    this.enteredPassword = '';
    this.deleteIndex = null;
  }

validateAndDelete() {
  if (this.enteredPassword === this.adminPassword) {
    if (this.deleteIndex !== null) {
      const feedbackId = this.feedbacks[this.deleteIndex].id;
      this.http.delete(`http://localhost:8000/feedback/${feedbackId}`)
        .subscribe({
          next: () => {
            this.feedbacks.splice(this.deleteIndex!, 1);
            this.cancelDelete();
          },
          error: () => {
            this.errorMsg = '❌ Failed to delete from server.';
          }
        });
    }
  } else {
    this.errorMsg = 'Incorrect password.';
  }
}

}

