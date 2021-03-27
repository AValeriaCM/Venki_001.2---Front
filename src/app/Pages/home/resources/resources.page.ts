import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { VimeoserviceService } from 'src/app/_services/vimeoservice.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {

  user = 'user119572637';
  videos;
  videosOriginal: any[] = [];
  video: any;
  constructor(
    private vimeoService: VimeoserviceService,
    private router: Router,
    private pObjecto: PassObjectService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.videos = this.vimeoService.getVideos(this.user);
    this.video=this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/499023755');
    
  }

  seeMore(id: number, info: any) {
    let dataObj = {
      vidinfo: info
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/home/vermas/']);
  }


  seeVideo(info :any){
    let dateVideo=info.url;
    let result=dateVideo.replace('vimeo.com','player.vimeo.com/video')
    this.video=this.sanitizer.bypassSecurityTrustResourceUrl(result);
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
  }  

}
