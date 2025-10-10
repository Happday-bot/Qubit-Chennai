import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminTopbarComponent } from '../admin_navigation/admin.admin_navigation.component';
import { SsrDataService } from '../../core/ssr-data.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule,AdminTopbarComponent],
  templateUrl: './manageGallery.component.html',
  styleUrls: ['./manageGallery.component.css'],
})
export class AdminGalleryComponent implements OnInit{
  newEntry = {
    alt: '',
    caption: '',
    image_base64: ''
  };

  selectedImage: File | null = null;
  previewUrl: string | null = null;
  uploadMsg = '';
  accessToken='';
  private url = environment.apiUrl; // Use environment variable for API URL

  constructor(private http: HttpClient, private ssrData:SsrDataService, private router:Router) {}

  ngOnInit(): void {
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

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.previewUrl = base64;
        this.newEntry.image_base64 = base64;
      };
      reader.readAsDataURL(file); // Encodes as base64
    }
  }

  onSubmit(): void {
    if (!this.selectedImage) {
      this.uploadMsg = 'Please select an image before uploading.';
      return;
    }

    const payload = {
      alt: this.newEntry.alt,
      caption: this.newEntry.caption,
      image_data: this.newEntry.image_base64
    };

    this.http.post(`${this.url}/gallery/upload`, payload).subscribe({
      next: () => {
        this.uploadMsg = '✅ Image uploaded successfully!';
        this.resetForm();
      },
      error: () => {
        this.uploadMsg = '❌ Upload failed.';
      }
    });
  }

  private resetForm() {
    this.newEntry = { alt: '', caption: '', image_base64: '' };
    this.selectedImage = null;
    this.previewUrl = null;
    setTimeout(() => {
      this.uploadMsg = '';
    }, 3000);
  }
}
