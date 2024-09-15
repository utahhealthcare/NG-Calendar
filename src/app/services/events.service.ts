import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TrumbaEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  feedUrl = environment.eventsAPI;
  
  constructor(private http: HttpClient) { }

  getEvents(): Observable<TrumbaEvent[]> {
    return this.http.get<TrumbaEvent[]>(this.feedUrl);
  }
}
