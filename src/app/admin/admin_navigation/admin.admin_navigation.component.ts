import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SsrDataService } from '../../core/ssr-data.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin_navigation.component.html',
  styleUrls: ['./admin_navigation.component.css']
})
export class AdminTopbarComponent {
    constructor(private http:HttpClient, private router: Router, private ssrData:SsrDataService){}
    private url = environment.apiUrl; // Use environment variable for API URL
    logout() {
  this.http.post(`${this.url}/logout`, {}, { withCredentials: true }).subscribe({
    next: () => {
      this.ssrData.clearToken(); // ⛔ clear in-memory & localStorage
      this.router.navigate(['/login']);
    }
  });
}
}
