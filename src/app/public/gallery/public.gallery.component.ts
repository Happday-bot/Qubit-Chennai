import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsrDataService } from '../../core/ssr-data.service'; // adjust path as needed
import { NavbarComponent } from '../navigation/public.navigation.component';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  private ssr = inject(SsrDataService);

  galleryImages: { id: number; src: string; alt: string; caption: string }[] = [];
  loading = true;
  private url = environment.apiUrl; // Use environment variable for API URL

  ngOnInit(): void {
    this.ssr.fetch(
      'gallery',
      `${this.url}/gallery/all`,
      (response: any[]) =>
        response.map(item => ({
          id: item.id,
          src: item.image_data,
          alt: item.alt,
          caption: item.caption
        }))
    ).subscribe({
      next: (data) => {
        this.galleryImages = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Failed to load gallery images:', err);
      }
    });
  }
}
