import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular'; 

@Component({
  selector: 'app-terminos-ninos',
  templateUrl: './terminos-ninos.page.html',
  styleUrls: ['./terminos-ninos.page.scss'],
})
export class TerminosNinosPage implements OnInit {

  constructor(private pop:PopoverController) { }

  ngOnInit() {
  }

  ClosePopover(){
    this.pop.dismiss();
  }

}
