import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { PLATFORM_ID } from '@angular/core';
import Quill from 'quill';

// --- Extend Quill fonts globally ---
const Font = Quill.import('formats/font') as any;
Font.whitelist = [
  'arial', 'times-new-roman', 'courier-new', 'georgia', 'impact', 'tahoma', 'verdana'
];
Quill.register(Font, true);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
     provideRouter(routes),
     { provide: PLATFORM_ID, useValue: 'browser' }
  ]
});
