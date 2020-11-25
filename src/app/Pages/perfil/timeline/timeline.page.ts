import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {

  infoTimeline;
  currentUser;
  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;
  paginaActual: any;
  ultimaPage: any;
  totalDt: any;
  constructor(
    private auth: AuthService,
    private log: LoginService,
    private share: ShareserviceService
  ) { }

  ngOnInit() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.currentUser = infoUser.name + ' ' + infoUser.lastname;
        this.share.getTimeline(infoUser.id).subscribe( Res => {
          console.log(Res);
          this.infoTimeline = Res.data;
          this.paginaActual = Res.meta.current_page;
          this.ultimaPage = Res.meta.last_page;
          this.totalDt = Res.meta.total;
        })
      });
    });
  }

  loadData(event: any){
    console.log('evento', event);
    this.paginaActual = this.paginaActual + 1;
    setTimeout(() => {
        console.log(this.infoTimeline.length);

        if (this.infoTimeline.length >= this.totalDt){
          event.target.complete();
          this.infonitescroll.disabled  = true;
          return;
        }


        this.share.getpostNextPage(this.paginaActual).subscribe( resPg => {
          console.log('Respuesta paguina', resPg);
          resPg.data.forEach(element => {
            this.infoTimeline.push(element);
          });
          event.target.complete();
        });
    }, 2000);
  }

}
