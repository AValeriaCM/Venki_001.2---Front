import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading = false;
  constructor(public loadingController: LoadingController) { }

  async loadingPresent(options: any = {}) {
    this.loading = true;
    return await this.loadingController.create(options).then(a => {
      a.present().then(() => {
        if (!this.loading) {
          a.dismiss();
        }
      });
    });
  }

  async loadingDismiss() {
    this.loading = false;
    while (await this.loadingController.getTop() !== undefined) {
      await this.loadingController.dismiss();
    }
  }
}
