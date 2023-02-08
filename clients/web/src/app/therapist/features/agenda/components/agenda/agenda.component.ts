import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { 
  CalendarView, 
  CalendarDateFormatter,
  DAYS_OF_WEEK,
  CalendarEvent,
  DateAdapter,
  getWeekViewPeriod
} from 'angular-calendar';
import { differenceInMinutes, startOfDay, startOfHour } from 'date-fns';
import { Subject } from 'rxjs';
import {Title} from "@angular/platform-browser";
import { takeUntil, map } from 'rxjs/operators';
import { DateFormatter } from '../../providers/date-format.provider';
import { trackByWeekDayHeaderDate } from '../../calendar-templates/utils/calendar-utils'; 
import { AppointmentService } from '../../../../therapist-shared/services/appointment.service';
import { AppointmentsResponse, Appointment } from '../../../../therapist-shared/interfaces/appointment';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: [
    './agenda.component.scss',
    '../../calendar-templates/scss/week-view-global-styles.scss'
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: DateFormatter,
    },
  ],
  encapsulation: ViewEncapsulation.None
})
export class AgendaComponent implements OnInit, AfterViewInit, OnDestroy {
  scrollContainer: any | null = null;

  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  locale: string = 'fr';

  daysInWeek = 7;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

  createAppointmentModalTriggered: boolean = false;

  updateAppointmentModalTriggered: boolean = false;
  appointmentToUpdate: Appointment = null;

  events: CalendarEvent[] = [];

  private destroy$ = new Subject();


  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private as: AppointmentService,
    private dateAdapter: DateAdapter,
    private tabTitle: Title
  ) {
    this.tabTitle.setTitle("Psynder | Agenda")
  }


  ngOnInit() {
    const CALENDAR_RESPONSIVE = {
      small: {
        breakpoint: '(max-width: 576px)',
        daysInWeek: 2,
      },
      medium: {
        breakpoint: '(max-width: 768px)',
        daysInWeek: 3,
      },
      large: {
        breakpoint: '(max-width: 960px)',
        daysInWeek: 5,
      },
    };
    this.breakpointObserver
      .observe(
        Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
          ({ breakpoint }) => !!state.breakpoints[breakpoint]
        );
        if (foundBreakpoint) {
          this.daysInWeek = foundBreakpoint.daysInWeek;
        } else {
          this.daysInWeek = 7;
        }
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.scrollContainer = document.querySelector('.cal-time-events');
    if (this.view === CalendarView.Week) {
      /* scroll to current time */
      this.scrollToCurrentView();
      this.getAppointmentsForTimeframe();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  setView(view: CalendarView) {
    this.view = view;
    if (this.view === CalendarView.Week) {
      /* scroll to current time */
      this.scrollToCurrentView();
      this.getAppointmentsForTimeframe();
    }
  }


  private scrollToCurrentView() {
    if (!this.scrollContainer)
      return;
    const minutesSinceStartOfDay = differenceInMinutes(
      startOfHour(new Date()),
      startOfDay(new Date())
    );
    const headerHeight = this.view === CalendarView.Week ? 60 : 0;
    this.scrollContainer.scrollTop =
      minutesSinceStartOfDay + headerHeight;
  }


  getAppointmentsForTimeframe() {
    // TODO: implement getMonthViewPeriod
    const { viewStart, viewEnd } = getWeekViewPeriod(
      this.dateAdapter,
      this.viewDate,
      this.weekStartsOn,
    );
    this.as.getAppointmentsWithinTimeframe(viewStart, viewEnd).pipe(
      map(
        (res: AppointmentsResponse) => res.appointments
      )).subscribe( (apts: Array<Appointment>) => {
      this.events = [];
      for (let apt of apts) {
        const user = apt.user;
        let endDate = new Date(apt.date);
        endDate.setMinutes(endDate.getMinutes() + apt.durationInMin);
        this.events.push({
          id: apt._id,
          title: user.firstName + '  ' + user.lastName,
          color: {
            primary: '#FBEA9D',
            secondary: '#FBEA9D'
          },
          start: new Date(apt.date),
          end: endDate
        });
      }
      this.as.setCurrentWeekAppointments(apts);
      this.cdr.detectChanges();
    }, (err) => console.error(err));
  }

  onWeekEventClick(event: CalendarEvent) {
    this.appointmentToUpdate = this.as.currentWeekAppointments.find(apt => apt._id === event.id);
    this.updateAppointmentModalTriggered = true
  }

  /* Calendar template helpers */
  trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
}
