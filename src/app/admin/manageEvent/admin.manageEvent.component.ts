import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminTopbarComponent } from '../admin_navigation/admin.admin_navigation.component';
import { Router } from '@angular/router';
import { SsrDataService } from '../../core/ssr-data.service';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

interface EventItem {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  registrationOpen: string;
  registrationClose: string;
  posterPath?: string;
  link:string;
}

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, FormsModule,AdminTopbarComponent],
  templateUrl: './manageEvent.component.html',
  styleUrls: ['./manageEvent.component.css']
})
export class ManageEventsComponent implements OnInit {
  showForm = false;
  editMode = false;
  selectedEventIndex: number | null = null;
  previewUrl: string | null = null;
  events: EventItem[] = [];
  event: EventItem = this.resetForm();
  readonly eventPassword = 'admin@2025';
  accessToken: string = '';
  private url = environment.apiUrl; // Use environment variable for API URL

  constructor(private http: HttpClient, private router:Router,private ssrData:SsrDataService) {}

  ngOnInit(): void {
    this.fetchEvents();
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

  fetchEvents() {
    this.http.get<EventItem[]>(`${this.url}/events/all`).subscribe({
      next: (data) => {
        this.events = data;
      },
      error: () => {
        alert('Failed to load events.');
      }
    });
  }

  resetForm(): EventItem {
    return {
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      type: '',
      registrationOpen: '',
      registrationClose: '',
      posterPath: '',
      link:''
    };
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.event = this.resetForm();
    this.editMode = false;
    this.previewUrl = null;
  }

  onPosterSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.event.posterPath = this.previewUrl!;
      };
      reader.readAsDataURL(file);
    }
  }

saveEvent() {
  if (this.editMode && this.selectedEventIndex !== null) {
    const updatedEvent = {
      ...this.event,
      id: this.events[this.selectedEventIndex].id // required for update
    };

    this.http.put('http://localhost:8000/events/update', updatedEvent).subscribe({
      next: () => {
        alert('✅ Event updated successfully.');
        this.fetchEvents();     // reload events from backend
        this.toggleForm();
      },
      error: () => {
        alert('❌ Failed to update event.');
      }
    });
  } else {
    this.http.post('http://localhost:8000/events/add', this.event).subscribe({
      next: () => {
        alert('✅ Event created.');
        this.fetchEvents();
        this.toggleForm();
      },
      error: () => {
        alert('❌ Failed to create event.');
      }
    });
  }
}


editEvent(index: number) {
  const password = prompt('Enter admin password to edit event:');
  if (password !== this.eventPassword) {
    alert('Incorrect password. Access denied.');
    return;
  }

  this.editMode = true;
  this.selectedEventIndex = index;
  this.event = { ...this.events[index] };
  this.previewUrl = this.event.posterPath || null;
  this.showForm = true;
}


  deleteEvent(index: number) {
    const password = prompt('Enter admin password to delete event:');
    if (password === this.eventPassword) {
      const eventId = this.events[index].id;
      if (eventId && confirm('Are you sure?')) {
        this.http.delete(`http://localhost:8000/events/${eventId}`).subscribe({
          next: () => this.fetchEvents(),
          error: () => alert('Failed to delete event.')
        });
      }
    } else {
      alert('Incorrect password. Deletion denied.');
    }
  }
}
