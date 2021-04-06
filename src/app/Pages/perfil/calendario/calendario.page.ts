import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  eventSource = [];
  viewTitle: string;
  calendar = {
    locale: 'es',
    mode: 'month',
    currentDate: new Date()
  };
  selectDate: Date;
  token: any;
  userId: any;
  targets =  [];

  constructor(
    private auth: AuthService,
    private loadingService: LoadingService,
    private log: LoginService,
    private share: ShareserviceService,
    private datePipe: DatePipe
  ) { 
    this.getToken();
  }

  ngOnInit() {
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.getTargets();
    });
  }

  getTargets() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.auth.gettokenLog().then(dt => {
      this.log.logdataInfData(dt).subscribe(infoUser => {
        this.userId = infoUser.id;
        this.share.obtenerObhetivos(this.userId, this.token).subscribe((res: any) => {
          this.targets = res.data;
          this.loadEvents();
          this.loadingService.loadingDismiss();
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }

  loadEventsTargets() {
    var events = [];
    this.targets.map( (target: any) => {
      if(target.date) {
        events.push({
          title: target.achievement,
          startTime: new Date(target.date + " 00:00:00"),
          endTime: new Date(target.date + " 00:00:00"),
          allDay: true
        });
      }
    });
    console.log('events', events);
    return events; 
  }

  caledarNext(){
    this.myCal.slideNext();
  }

  calendarBack(){
    this.myCal.slidePrev();
  }

  calendarOnViewTitelChange(title){
    this.viewTitle = title;
  }

  loadEvents() {
    this.eventSource = this.loadEventsTargets();
  }

  createRandomEvents() {
    var events = [];
    for (var i = 0; i < 50; i += 1) {
        var date = new Date();
        var eventType = Math.floor(Math.random() * 2);
        var startDay = Math.floor(Math.random() * 90) - 45;
        var endDay = Math.floor(Math.random() * 2) + startDay;
        var startTime;
        var endTime;
        if (eventType === 0) {
            startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
            if (endDay === startDay) {
                endDay += 1;
            }
            endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
            events.push({
                title: 'All Day - ' + i,
                startTime: startTime,
                endTime: endTime,
                allDay: true
            });
        } else {
            var startMinute = Math.floor(Math.random() * 24 * 60);
            var endMinute = Math.floor(Math.random() * 180) + startMinute;
            startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
            endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
            events.push({
                title: 'Event - ' + i,
                startTime: startTime,
                endTime: endTime,
                allDay: false
            });
        }
    }
    return events;
  }
}
