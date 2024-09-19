import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarListComponent } from "./components/calendar-list/calendar-list.component";

@Component({
  selector: 'calendar-app',
  standalone: true,
  imports: [RouterOutlet, CalendarListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
