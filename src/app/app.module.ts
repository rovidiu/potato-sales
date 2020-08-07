import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MenubarModule } from 'primeng/menubar';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/_common/header/header.component';
import { FooterComponent } from './components/_common/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/user/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

import { AuthGuard } from './helpers/auth-guard.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './components/_common/message/message.component';

import { apiServerProvider } from './helpers/api-server';
import { NewComponent } from './components/product/new/new.component';
import { SalesComponent } from './components/sales/sales.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    WelcomeComponent,
    MessageComponent,
    NewComponent,
    SalesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule,
    BrowserAnimationsModule,
    TableModule,
    FormsModule,
    DialogModule
  ],
  providers: [
    AuthGuard,

    // provider used to create fake api server
    apiServerProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
