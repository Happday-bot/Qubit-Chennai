import { Routes } from '@angular/router';
import { AboutComponent } from './public/about/public.about.component';
import { ContactComponent } from './public/contact/public.contact.component';
import { HomeComponent } from './public/home/public.home.component';
import { EventsComponent} from './public/events/public.events.component';
import { GalleryComponent } from './public/gallery/public.gallery.component';
import { BlogComponent } from './public/blog/public.blog.component';
import { LoginComponent } from './public/login/public.login.component';
import { ProfileComponent } from './student/student.component';
import {NotFoundComponent} from './404/404.component';
import {AdminGalleryComponent} from './admin/manageGallery/admin.manageGallery.component';
import {FeedbackManagerComponent} from './admin/manageFeedback/admin.manageFeedback.component';
import {ManageEventsComponent} from './admin/manageEvent/admin.manageEvent.component';
import { MemberManagementComponent } from './admin/manageMember/admin.manageMember.component';
import { QuantumRegistrationComponent } from './public/signup/public.signup.component';
import { RoleGuard } from './gaurds/role.gaurd';
import {TabReleaseInfoComponent} from './tab-release/tab-release';
import { BlogWriteComponent } from './writeblog/writeblog.component';


export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'events',
        component: EventsComponent
    },
    {
        path: 'gallery',
        component: GalleryComponent
    },
    {
        path: 'blog',
        component: BlogComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'sign-up',
        component: QuantumRegistrationComponent
    },
    {
        path: 'student/profile',
        component: ProfileComponent
    },
    {
        path: 'admin/gallery',
        component: AdminGalleryComponent,canActivate: [RoleGuard]
    },
    {
        path: 'admin/feedback',
        component: FeedbackManagerComponent,canActivate: [RoleGuard]
    },
    {
        path: 'admin/events',component: ManageEventsComponent,canActivate: [RoleGuard]
    },
    {
        path: 'admin/members',component: MemberManagementComponent,canActivate: [RoleGuard]
    },
    {
        path: 'tab-release-info',loadComponent: () => import('./tab-release/tab-release').then(m => m.TabReleaseInfoComponent)
    },
    {
        path: 'blog/write',component: BlogWriteComponent
    },
    { 
        path: '**',component: NotFoundComponent
    }
];
