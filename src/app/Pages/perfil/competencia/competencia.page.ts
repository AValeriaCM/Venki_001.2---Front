import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, AlertController, IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { environment } from 'src/environments/environment';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPE = "video/mp4";

@Component({
  selector: 'app-competencia',
  templateUrl: './competencia.page.html',
  styleUrls: ['./competencia.page.scss'],
})
export class CompetenciaPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;
  @ViewChild('videoCompetence', {static: false}) videoCompetence: ElementRef;

  colors = ['#ff9800', '#4caf50'];
  idAction: number;
  token: any;
  usertk = null;
  message: any;
  photos: Array<any> = new Array();
  loading: any;
  uploadedVideo: string;
  selectedVideo: string;
  videBase64: string;
  alert: any;
  posts: Array<any> = new Array();
  actualPage: any;
  totalDt: any;
  lastPage: any;
  basePath = `${environment.HOST}`;
  url = null;

  constructor(
    private pObjecto: PassObjectService,
    private router: Router,
    private auth: AuthService,
    private log: LoginService,
    private actionSheetcontroller: ActionSheetController,
    private imagePick: ImagePicker,
    private snackbar: MatSnackBar,
    private camara: Camera,
    private loadingCtrl: LoadingController,
    private webview: WebView,
    private file: File,
    public alertController: AlertController,
    private loadingService: LoadingService,
    private share: ShareserviceService,
    private changeDetectorRef: ChangeDetectorRef
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.getInformation();

    this.share.varPostUpdate.subscribe( res => {
      this.infonitescroll.disabled  = false;
      this.getPosts();
    });
  }

  getInformation() {
    const informacion = this.pObjecto.getNavData();
    this.idAction = informacion.idAction;
  }

  placeholder(idAction: number) {
    if (idAction === 1) {
      return 'Detalla mas información';
    }
    if (idAction === 2) {
      return 'Detalla mas información';
    }
  }

  getToken() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.log.logdataInfData(resp).subscribe( user => {
        this.usertk = user;
        this.getPosts();
        this.loadingService.loadingDismiss();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }

  getPosts() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getPostCompetence(this.token, this.usertk.id).subscribe( res => {
      this.posts = res.data.filter( (post: any) => post.type === this.idAction);
      this.actualPage = res.meta.current_page;
      this.lastPage = res.meta.first_page;
      this.totalDt = res.meta.total;
      this.loadingService.loadingDismiss();
    });
  }

  async seePublication(publication) {
    const dataObj = {
      publication: publication
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/publicacion']);
  }

  async selectImg() {
    const acctionSheet = await this.actionSheetcontroller.create({
      header: 'Seleccione una imagen',
      cssClass: 'match-item-action-sheet',
      buttons: [
        {
          text: 'Galeria',
          icon: 'image-outline',
          handler: () => {
            this.usarGaleria();
          }
        },
        {
          text: 'Camara',
          icon: 'camera-outline',
          handler: () => {
            this.usarCamara();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await acctionSheet.present();
  }

  usarGaleria() {
    if(this.photos.length < 5) {
      this.imagePick.hasReadPermission().then( (result) => {
        if( result == false) {
          this.imagePick.requestReadPermission();
        } else if( result == true) {
          this.imagePick.getPictures({
            maximumImagesCount: 5 - this.photos.length,
            quality: 100,
            outputType: 1
          }).then((results) => {
            for (var i = 0; i < results.length; i++) {
              const imgsend = 'data:image/jpeg;base64,' + results[i];
              this.photos.push(imgsend);
            }
          }).catch( (error) => {
            this.mostrarmensaje('Se presento un error al cargar las imágenes, por favor comuníquese con el administrador.', 'Error', 'red-snackbar');
          });
        }
      });
    } else {
      this.mostrarmensaje('El máximo de imágenes adjuntas es de 5', 'Error', 'red-snackbar');
    }
  }

  async usarCamara() {
    if(this.photos.length < 5) {
      const options: CameraOptions = {
        quality: 100,
        correctOrientation: true,
        destinationType: this.camara.DestinationType.DATA_URL,
        encodingType: this.camara.EncodingType.JPEG,
        mediaType: this.camara.MediaType.PICTURE
      }
      await this.camara.getPicture(options).then( (res) => {
          this.photos.push('data:image/jpeg;base64,' + res); 
      }).catch( (error) => {
        if(error == 'No Image Selected') {
          this.mostrarmensaje('No se seleccionó ninguna imagen', 'Error', 'red-snackbar');
        }
      });
    } else {
      this.mostrarmensaje('El máximo de imágenes adjuntas es de 5', 'Error', 'red-snackbar');
    }
  }

  loadVideo() {
    const that = this;
    const options: CameraOptions = {
      mediaType: this.camara.MediaType.VIDEO,
      sourceType: this.camara.PictureSourceType.PHOTOLIBRARY
    }
    this.camara.getPicture(options).then( async (data) => {
        if (data) {

          this.showLoader();

          this.url = this.webview.convertFileSrc(data);
          this.changeDetectorRef.detectChanges(); 
          let video = that.videoCompetence.nativeElement;
          video.src = this.url;
          video.play();

          this.uploadedVideo = null;
          var filename = data.substr(data.lastIndexOf('/') + 1);
          var dirpath = data.substr(0, data.lastIndexOf('/') + 1);
          dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;

          try {
            var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
            var retrievedFile = await this.file.getFile(dirUrl, filename, {});
          } catch(err) {
            that.removeVideo();
            this.dismissLoader();
            return this.presentAlert("Error","Ha ocurrido un error");
          }
          
          retrievedFile.file( data => {
            this.dismissLoader();
            if (data.size > MAX_FILE_SIZE) {
              that.removeVideo();
              return this.presentAlert("Error", "No puedes subir más de 5MB.");
            }
            if (data.type !== ALLOWED_MIME_TYPE)  {
              that.removeVideo();
              return this.presentAlert("Error", "Tipo de archivo incorrecto.");
            }
            this.selectedVideo = retrievedFile.nativeURL;
            let reader = new FileReader();
            reader.readAsDataURL(data);
            reader.onloadend = async (evt: any) => {
              let encodingType = "data:video/mp4;base64,";
              let OriginalBase64 = evt.target.result.split(',')[1];
              let decodedBase64 = atob(OriginalBase64);
              let encodedBase64 = btoa(decodedBase64);
              let newBase64 = encodingType + encodedBase64;
              this.videBase64 = newBase64;
            };
            reader.onerror = function(e)
            {
              that.removeVideo();
              that.mostrarmensaje('Ha ocurrido un error', 'Error', 'red-snackbar');
            }
          });
        }
    },
    (err) => {
      that.removeVideo();
      that.mostrarmensaje('Ha ocurrido un error', 'Error', 'red-snackbar');
    });
  }

  removeImagen(imagen: any) {
    const index = this.photos.findIndex(img => img === imagen);
    if(index >= 0) {
      this.photos.splice(index, 1);
    }
  }

  removeVideo() {
    this.url = null;
    this.selectedVideo = null;
    this.videBase64 = null; 
  }

  post() {
    if(this.message && (this.photos.length > 0 || this.url) ) {
      this.loadingService.loadingPresent({spinner: "circles" });
      const images = new Array();
      if(this.photos.length > 0) {
        this.photos.map( media => {
          images.push({
            image: media
          });
        });
      }
      const videos = new Array();
      if(this.videBase64) {
        videos.push({
          video: this.videBase64
        })
      }
      const form = {
        user_id: this.usertk.id,
        comment: this.message,
        images: images,
        videos: videos,
        type: this.idAction
      }
      this.share.savePostCompetence(form, this.token).subscribe(  res => {
        this.message = null;
        this.photos = new Array();
        this.removeVideo();
        this.loadingService.loadingDismiss();
        this.share.varPostUpdate.next('update data');
      }, error => {
        this.loadingService.loadingDismiss();
      });
    } else {
      this.alertDespuesTiempo();
    }
  }

  loadData(event: any) {
    this.actualPage = this.actualPage + 1;
    setTimeout(() => {
      if (this.posts.length >= this.totalDt){
        event.target.complete();
        this.infonitescroll.disabled  = true;
        return;
      }
      this.share.getPostCompetenceNextPage(this.actualPage, this.token, this.usertk.id).subscribe( resPg => {
        resPg.data.filter( (post: any) => post.type === this.idAction).map( (post: any) => {
          this.posts.push(post);
        });
        event.target.complete();
      });
    }, 5000);
  }

  async alertDespuesTiempo() {
    this.alert = await this.alertController.create({
      header: 'HEY!',
      subHeader:
        'Cuentanos que piensas',
      message:
        'Debes escribir algo y publicar una imagen o un video',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  async presentAlert(title, message) {
    this.removeVideo();
    let alert = await this.alertController.create({
      header: title,
      subHeader: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  dismissLoader() {
    this.loading.dismiss();
  }

  async showLoader() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando Datos...'
    });
    return this.loading.present();
  }

  back() {
    this.router.navigate(['/users/perfil']);
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }
}
