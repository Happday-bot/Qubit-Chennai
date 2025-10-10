import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../public/navigation/public.navigation.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-blog-write',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NavbarComponent, NgIf],
  templateUrl: './blogWrite.component.html',
  styleUrls: ['./blogWrite.component.css']
})
export class BlogWriteComponent {
  blogUrl: string = '';
  isLoading = false;
  message: string = '';

  constructor(private http: HttpClient) {}

  fetchMetadata() {
    if (!this.blogUrl) return;

    this.isLoading = true;
    this.message = '';

    this.http.post('http://localhost:8000/scrape', { url: this.blogUrl })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.message = '✅ Blog metadata imported successfully.';
          this.blogUrl = '';
        },
        error: () => {
          this.isLoading = false;
          this.message = '❌ Failed to import blog. Please check the URL.';
        }
      });
  }
}
