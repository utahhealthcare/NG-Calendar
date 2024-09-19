import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { TrumbaEvent } from '../../models/event.model';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-calendar-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './calendar-list.component.html',
  styleUrl: './calendar-list.component.scss'
})
export class CalendarListComponent implements OnInit {
  events: TrumbaEvent[] = [];
  filteredEvents: TrumbaEvent[] = [];

  // Pagination settings
  currentPage = 1;
  itemsPerPage = 10;
  paginatedEvents: TrumbaEvent[] = [];

  // Filter options
  selectedDate: Date | null = null;
  selectedService: string = '';
  selectedEventType: string = '';
  searchQuery: string = '';

  // Dynamic options for filters
  applicableServices: string[] = [];
  eventTypes: string[] = [];

  constructor(private trumbaService: EventsService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.trumbaService.getEvents().subscribe((data: TrumbaEvent[]) => {
      this.events = data;
      this.filteredEvents = data; // Initialize with all events

      // Extract all unique 'Applicable Service' and 'Event Type' values
      this.applicableServices = this.extractAllValues('Applicable Service');
      this.eventTypes = this.extractAllValues('Event Type');

      this.updatePaginatedEvents();
    });
  }

  // Extract all values for a given custom field label across all events
  extractAllValues(label: string): string[] {
    const allValues: string[] = [];
    this.events.forEach(event => {
      event.customFields.forEach(field => {
        if (field.label === label && field.value) {
          allValues.push(field.value.trim());
        }
      });
    });
    return Array.from(new Set(allValues)); // Use a Set to avoid duplicates
  }

  // Method to filter the events based on the selected filters
  filterEvents(): void {
    this.filteredEvents = this.events
      .filter(event => this.filterByDate(event))
      .filter(event => this.filterByService(event))
      .filter(event => this.filterByEventType(event))
      .filter(event => this.filterBySearchQuery(event));
  
    // After filtering, reset to the first page and update the paginated events
    this.currentPage = 1;
    this.updatePaginatedEvents();
  
    // Scroll to the top of the search section
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Filter by selected date (include all events from the selected date onward)
  filterByDate(event: TrumbaEvent): boolean {
    if (!this.selectedDate) return true;
    const eventDate = new Date(event.startDateTime);
    return eventDate >= new Date(this.selectedDate);
  }

  // Filter by selected applicable service
  filterByService(event: TrumbaEvent): boolean {
    if (!this.selectedService) return true;
    return event.customFields.some(field => field.label === 'Applicable Service' && field.value === this.selectedService);
  }

  // Filter by selected event type
  filterByEventType(event: TrumbaEvent): boolean {
    if (!this.selectedEventType) return true;
    return event.customFields.some(field => field.label === 'Event Type' && field.value === this.selectedEventType);
  }

  // Filter by search query (title or description)
  filterBySearchQuery(event: TrumbaEvent): boolean {
    if (!this.searchQuery) return true;
    const query = this.searchQuery.toLowerCase();
    return event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query);
  }

  // Pagination: update the paginated events array based on the current page
  updatePaginatedEvents(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.filteredEvents.slice(startIndex, endIndex);
  }

  // Change the page
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedEvents();
  }

  // Method to clear all filters
  clearFilters(): void {
    this.selectedDate = null;
    this.selectedService = '';
    this.selectedEventType = '';
    this.searchQuery = '';
    this.filterEvents(); // Reapply the filters with default values
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1); // Generate an array of page numbers
  }

  // TrackBy function to track events
  trackByEvent(index: number, event: TrumbaEvent): number {
    return event.eventID;
  }

  getFailedFiltersSummary(): string {
    const filters: string[] = [];
  
    if (this.searchQuery) {
      filters.push(`Search: '${this.searchQuery}'`);
    }
    if (this.selectedDate) {
      const formattedDate = new Date(this.selectedDate).toLocaleDateString('en-US');
      filters.push(`Date: ${formattedDate}`);
    }
    if (this.selectedService) {
      filters.push(`Service: ${this.selectedService}`);
    }
    if (this.selectedEventType) {
      filters.push(`Event Type: ${this.selectedEventType}`);
    }
  
    // Join all filters into a single string
    return filters.length ? filters.join(', ') : '';
  }

  formatEventDate(dateString: string): string {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',  // e.g., Thu
      year: 'numeric',   // e.g., 2024
      month: 'short',    // e.g., Sep
      day: 'numeric'     // e.g., 19
    };

    const datePart = date.toLocaleDateString('en-US', options);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const timePart = `${formattedHours}:${formattedMinutes}${period}`;

    return `${datePart} | ${timePart}`;
  }

  // Method to sanitize the location HTML before displaying it
  getSanitizedLocation(location: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(location);
  }
}