import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserloginComponent } from './userlogin/userlogin.component';
import { AdminComponent } from './admin.component/admin.component';
import { CreatePosterComponent } from './create-poster/create-poster.component';
import { AuthGuard } from './auth.gaurd';
import { ForgetPassComponent } from './forget-pass/forget-pass.component';
import { ViewPoster } from './view-poster/view-poster.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userlogin', component: UserloginComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'create-poster', component: CreatePosterComponent, canActivate: [AuthGuard] },
  { path: 'forget-pass', component: ForgetPassComponent },
  { path: 'poster/:id', component: ViewPoster},
  { path: '**', redirectTo: '' }
];
