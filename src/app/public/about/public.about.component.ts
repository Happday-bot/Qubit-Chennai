import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navigation/public.navigation.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports:[RouterLink,NavbarComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {}
