export interface EventImage {
  url: string;
  size: {
    width: number;
    height: number;
  };
}

export interface CustomField {
  fieldID: number;
  label: string;
  value: string;
  type: number;
}

export interface TrumbaEvent {
  eventID: number;
  template: string;
  title: string;
  description: string;
  locationType: string;
  location: string;
  webLink: string;
  startDateTime: string;
  endDateTime: string;
  dateTimeFormatted: string;
  allDay: boolean;
  startTimeZoneOffset: string;
  endTimeZoneOffset: string;
  canceled: boolean;
  openSignUp: boolean;
  reservationFull: boolean;
  pastDeadline: boolean;
  pastCancelDeadline: boolean;
  requiresPayment: boolean;
  refundsAllowed: boolean;
  waitingListAvailable: boolean;
  repeatingRegistration: number;
  repeats: string;
  seriesID: number;
  eventImage: EventImage;
  detailImage: EventImage;
  customFields: CustomField[];
  permaLinkUrl: string;
  eventActionUrl: string;
  categoryCalendar: string;
  registrationTransferTargetCount: number;
  regAllowChanges: boolean;
}
