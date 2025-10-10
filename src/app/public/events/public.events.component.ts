import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsrDataService } from '../../core/ssr-data.service'; // Adjust path as needed
import { NavbarComponent } from '../navigation/public.navigation.component';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  posterPath: string;
  registrationOpen: string;
  registrationClose: string;
  link: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  standalone: true,
  imports: [CommonModule,NavbarComponent]
})
export class EventsComponent implements OnInit {
  private ssr = inject(SsrDataService);

  constructor() {
  
}

  events: {
    upcoming: EventData[],
    ongoing: EventData[],
    completed: EventData[]
  } = {
    upcoming: [],
    ongoing: [],
    completed: []
  };

  loading = true;
  private url = environment.apiUrl; // Use environment variable for API URL

  ngOnInit(): void {

  this.ssr.fetch<{
    upcoming: EventData[],
    ongoing: EventData[],
    completed: EventData[]
  }>('events', `${this.url}/events`).subscribe({
    next: (data) => {
      this.events = data;
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}

get hasEvents(): boolean {
  return !!(this.events.upcoming.length || this.events.ongoing.length || this.events.completed.length);
}
}
