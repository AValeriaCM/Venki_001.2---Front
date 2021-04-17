import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-img-prev',
  templateUrl: './img-prev.page.html',
  styleUrls: ['./img-prev.page.scss'],
})
export class ImgPrevPage implements OnInit {

  img: any;

  @ViewChild('slider', {read: ElementRef}) slider: ElementRef;

  sliderOpts = {
    zoom: {
      maxRatio: 5
    },
  };

  constructor(private navParams: NavParams, private modalCRTL: ModalController) { }

  ngOnInit() {
    this.img = this.navParams.get('img');
  }

  zoom(zoomIn: boolean){
    let zoom = this.slider.nativeElement.swiper.zoom;
    if (zoomIn){
      zoom.in();
    } else {
      zoom.out();
    }
  }

  async close(isConfirmed: any) {
    await this.modalCRTL.dismiss({ confirmed: isConfirmed }, undefined);
  }

}
