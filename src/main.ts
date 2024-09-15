import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import 'zone.js';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withFetch())]
});