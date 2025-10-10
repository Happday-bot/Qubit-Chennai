import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsrDataService } from '../../core/ssr-data.service'; // adjust path
import { NavbarComponent } from '../navigation/public.navigation.component';
import { environment } from '../../../environments/environment.prod';

interface Blog {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  author_name: string;
  author_profile: string;
  twitter_handle: string;
  published_date: string;
  reading_time: string;
  cover_image: string;
  canonical_url: string;
  favicon: string;
  platform: string;
  twitter_card: string;
  tags: string | null;
}

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  private ssr = inject(SsrDataService);
  blogs: Blog[] = [];
  loading = true;
  private url = environment.apiUrl;

  ngOnInit(): void {
    this.ssr.fetch('blogs', `${this.url}/blogs/all`).subscribe({
  next: (response: any) => {
    this.blogs = Array.isArray(response.blogs) ? response.blogs : [];
    this.loading = false;
  },
  error: (err) => {
    console.error('❌ Failed to load blogs:', err);
    this.loading = false;
  }
});

  }
}
