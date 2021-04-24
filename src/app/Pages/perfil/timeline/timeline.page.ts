import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Timeline } from 'src/app/interfaces/timeline.interface';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {

  infoTimeline = [];
  currentUser;
  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;
  paginaActualPosts: any;
  ultimaPagePosts: any;
  totalDtPosts: any;

  paginaActualFeelings: any;
  ultimaPageFeelings: any;
  totalDtFeelings: any;

  miactividad = [];
  feelings = [];
  timeline: Timeline[] = [];
  usertk = null;
  token: any;

  constructor(
    private auth: AuthService,
    private log: LoginService,
    private share: ShareserviceService,
    private loadingService: LoadingService
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.currentUser = infoUser.name + ' ' + infoUser.lastname;
        this.share.getTimeline(infoUser.id, this.token).subscribe( Res => {
          this.loadingService.loadingDismiss();
          this.infoTimeline = Res.data;
          this.paginaActualPosts = Res.meta.current_page;
          this.ultimaPagePosts = Res.meta.last_page;
          this.totalDtPosts = Res.meta.total;
          this.usertk = infoUser;
          this.getMiactividad(this.usertk.id);
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
    });
  }

  getMiactividad(userid: any) {
    this.share.getActividadUsuario(userid, this.token).subscribe(info => {
      this.miactividad = info.data;
      this.paginaActualPosts = info.meta.current_page;
      this.ultimaPagePosts = info.meta.last_page;
      this.totalDtPosts = info.meta.total;
      this.getFeelings(userid);
    });
  }

  getFeelings(userid: any) {
    this.share.getFeeling(userid, this.token).subscribe(info => {
      this.feelings = info.data;
      this.paginaActualFeelings = info.meta.current_page;
      this.ultimaPageFeelings = info.meta.last_page;
      this.totalDtFeelings = info.meta.total;
      this.organizeData();
    })
  }

  organizeData() {
    this.miactividad.map( post => {
      this.timeline.push({
        type: 1,
        comment: post.post,
        date: post.created_at
      })
    });

    this.feelings.map( feeling => {
      this.timeline.push({
        type: 2,
        comment: feeling.name,
        date: feeling.created_at
      });
    }); 

    this.organizeTimelline();
  }

  organizeTimelline() {
    this.timeline = this.timeline.sort((a: any,b: any) => {
      return 0 - ( (new Date(a.date)).getTime() < (new Date(b.date)).getTime() ? -1 : 1)
    });
  }

  loadData(event: any) {
    this.paginaActualPosts = this.paginaActualPosts + 1;
    this.paginaActualFeelings = this.paginaActualFeelings + 1;
    setTimeout(() => {
        if (this.infoTimeline.length >= this.totalDtPosts) {
          event.target.complete();
          this.infonitescroll.disabled  = true;
          return;
        }

        this.share.getNextActividadUsuario(this.usertk.id, this.token, this.paginaActualPosts).subscribe( resPg => {
          resPg.data.forEach(element => {
            this.timeline.push({
              type: 1,
              comment: element.post,
              date: element.created_at
            })
          });
          this.organizeTimelline();
          event.target.complete();
        });

        this.share.getFeelingNextPage(this.usertk.id, this.paginaActualFeelings, this.token).subscribe( resPg => {
          resPg.data.forEach(element => {
            this.timeline.push({
              type: 2,
              comment: element.name,
              date: element.created_at
            });
          });
          this.organizeTimelline();
          event.target.complete();
        });
    }, 2500);
  }

}
