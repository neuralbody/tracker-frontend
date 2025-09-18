import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './core/auth/auth.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,    // provides interceptor + singleton services
    SharedModule,  // common imports: FormsModule / ReactiveFormsModule
    AuthModule     // auth components (login/register)
    // dashboard imported via lazy-loaded module (do NOT import DashboardModule here)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
