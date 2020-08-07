import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/user/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NewComponent } from './components/product/new/new.component';
import { SalesComponent } from './components/sales/sales.component';
import { AuthGuard } from './helpers/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'welcome',
    canActivate: [ AuthGuard ],
    component: WelcomeComponent
  },
  {
    path: 'product/new',
    canActivate: [ AuthGuard ],
    component: NewComponent
  },
  {
    path: 'sales',
    canActivate: [ AuthGuard ],
    component: SalesComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
