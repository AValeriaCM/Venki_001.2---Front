import { UsuariosF } from './../_model/_Usuario';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


const INFO_TEMP = 'diagnostico';
const ORDERSTRG = 'ordercourses';
const CURSOCONTROL = 'controlinfoCursoTemp';
const CURSOCONTROLNAME = 'CursoName';

@Injectable({
  providedIn: 'root'
})
export class ShareserviceService {

  url2 = `/api/user`;
  urlCuros = `/api/courses`;
  basePath = `https://venki.inkdigital.co`;
  // basePath = `http://127.0.0.1:8000`;

  var = new Subject<string>();
  varorder = new Subject<string>();
  varExam = new Subject<string>();
  varPostUpdate  = new Subject<string>();
  varDesafio  = new Subject<string>();
  varObjetivos = new Subject<string>();
  varTotalPreguntas = new Subject<string>();

  private data = [
    {
      category: 'Ejercicio',
      products: [
        { id: 0, name: 'Fisico', price: '80.000' },
        { id: 1, name: 'Calistenia', price: '50.000' },
        { id: 2, name: 'Rutina', price: '90.000' },
        { id: 3, name: 'Rutina 2', price: '70.000' }
      ]
    },
    {
      category: 'Ayuda tu mente',
      products: [
        { id: 4, name: 'Hablame', price: '80.000' },
        { id: 5, name: 'Escuchame', price: '60.000' }
      ]
    },
    {
      category: 'Salud',
      products: [
        { id: 6, name: 'Estadisticas salud', price: '80.000' },
        { id: 7, name: 'Dietas', price: '50.000' },
        { id: 8, name: 'Rutinas', price: '90.000' }
      ]
    }
  ];

  private cart = [];

  constructor(
    private http: HttpClient,
    private storage: Storage) { }


  gerDataService(TK: string){

    return this.http.get<any>(this.basePath + this.url2, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + TK)
  });
  }

  getCursos(){
    return this.http.get<any>(this.basePath + this.urlCuros, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
  });
  }

  getCategorias(){
    return this.http.get<any>(this.basePath + '/api/categories', {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
  });
  }

  getCursosUsuario(idUser: any){
    return this.http.get<any>(this.basePath + `/api/users/${idUser}/courses` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getCursosCategorias(idCat: any, idUser: any){
    //console.log('id cat', idCat, 'idUser', idUser);
    return this.http.get<any>(this.basePath + `/api/categories/${idCat}/courses?user_id=${idUser}` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  deleteCursoUsuario(idUser: any, idCurso: any){
    return this.http.delete(this.basePath + `/api/users/${idUser}/courses/${idCurso}`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getCursoEspecifico(id: number){

    return this.http.get<any>(this.basePath + this.urlCuros + `/${id}`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
  });
  }

  agregarCurso(idUser: any, curso: any){
    const body = new HttpParams()
      .set('course_id', curso);
    return this.http.post(this.basePath  + `/api/users/${idUser}/courses`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest'),
    });
  }

  actualizarProgreso(idUser:number,idCurso:number, progreso:any){
    console.log(idUser,idCurso,progreso);
    const body = new HttpParams()
      .set('progress', progreso);
    return this.http.put(this.basePath  + `/api/users/${idUser}/courses/${idCurso}`, body, {
      headers: new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Requested-With', 'XMLHttpRequest')
  });
  
  }

  getProducts() {
    return this.data;
  }

  getCart() {
    return this.cart;
  }

  addProduct(product) {
    this.cart.push(product);
  }

  enviarComentarioIPutuacion(idCurso: any, idUser: any, comment: any, score: any){
    //console.log('idcur'+idCurso, 'iduser'+idUser, 'coment'+comment, 'score'+score);
    const body = new HttpParams()
      .set('course_id', idCurso)
      .set('user_id', idUser)
      .set('comment', comment)
      .set('score', score);
    return this.http.post(this.basePath  + `/api/scores`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest'),
    });
  }

  getComentariosCurso(idCurso: any){
    return this.http.get<any>(this.basePath + `/api/courses/${idCurso}/scores`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
  });
  }

  actualizarPhoto(idUser: any, fotoUrl: any) {
    const formData = new FormData()
    formData.append('avatar', fotoUrl);
    formData.append('_method', 'PUT');
    return this.http.post(this.basePath + `/api/users/${idUser}`, formData, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  actualizarAvatar(idUser: any, imgUrl: UsuariosF) {
    const body = new HttpParams()
    .set('photo',imgUrl.avatar );
    return this.http.put(this.basePath + `/api/users/${idUser}`, body, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getNetDiagnostico(idDiagnostico: any, idPage: any){
    return this.http.get<any[]>(this.basePath + `/api/surveys/${idDiagnostico}/questions?page=${idPage}&per_page=15`, {
      headers: new HttpHeaders()
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  guardarDiagnostico(diagnostico: any){
    this.storage.set(INFO_TEMP, diagnostico);
  }

  retornarDiagnostico(){
    return this.storage.get(INFO_TEMP);
  }

  removerDiagnostico(){
    this.storage.remove(INFO_TEMP);
  }

  guardarDiagnosticoCurrenpage(page: any){
    this.storage.set('cpage', page);
  }

  retornarDiagnosticoCurrentpage(){
    return this.storage.get('cpage');
  }

  removerDiagnosticoCurrenpage(){
    this.storage.remove('cpage');
  }

  guardarDiagnosticoLastpage(page: any){
    this.storage.set('lpage', page);
  }

  retornarDiagnosticoLastpage(){
    return this.storage.get('lpage');
  }

  removerDiagnosticoLastpage(){
    this.storage.remove('lpage');
  }

  hayDiagnistico(){
    const diag = this.storage.get(INFO_TEMP);

    return diag.then(info => {
      console.log('diagnistico service', info);
      return info;
    });
  }

  hayorder() {
    const token = this.storage.get(ORDERSTRG);
    return token.then( val => {
      return val;
    });
  }

  iniciorder(){
    this.storage.set(ORDERSTRG, 1);
  }

  guardarLeccionActiva(dataCurso: any){
    this.storage.set(CURSOCONTROL, dataCurso);
  }

  guardarCursoActiva(dataCurso: any){
    this.storage.set(CURSOCONTROLNAME, dataCurso);
  }

  getleccionActiva(){
    return this.storage.get(CURSOCONTROL);
  }

  getcursoActivo(){
    return this.storage.get(CURSOCONTROLNAME);
  }

  verorder(){
    const token = this.storage.get(ORDERSTRG);
    return token;
  }

  updateorder(order: any){
    let inc = 1;
    inc =  order + inc;
    console.log('Order incrementado', inc);
    this.storage.set(ORDERSTRG, inc);
    this.varorder.next('update order');
  }

  guardarpost(userid: any, posttxt: any, media: any){

    console.log('user_id', userid, 'post', posttxt, 'medias[]', media);

    const formData = new FormData();
    formData.append('user_id', userid);
    formData.append('post', posttxt);
    formData.append('medias[]', media);

    return this.http.post(this.basePath + `/api/posts`, formData, {
      headers: new HttpHeaders()
    });
  }

  actualizarpost(userid: any, countlike: any) {
    const body = new HttpParams()
        .set('count_like', countlike);
    console.log('datos en el servicio -> antes de enviar', userid, countlike);
    return this.http.put(this.basePath + `/api/posts` + `/${userid}`, body, {
      headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getrecomendation(idUser: any){
    return this.http.get<any>(this.basePath + `/api/users/${idUser}/recomendations`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
  });
  }

  getTimeline(idUser: any){
    return this.http.get<any>(this.basePath + `/api/users/${idUser}/timelines`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getpost(){
    return this.http.get<any>(this.basePath + `/api/posts`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getpostNextPage(page: any){
    return this.http.get<any>(this.basePath + `/api/posts?page=${page}`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getActividadUsuario(idUser: any){
    return this.http.get<any>(this.basePath + `/api/users/${idUser}/posts` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  editpremium(premNum: any, id: number) {

    const body = new HttpParams()
      .set('premium', premNum);

    return this.http.put(this.basePath + `/api/users` + `/${id}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }


  editSurveyed(surveyedNum: any, id: number) {

    const body = new HttpParams()
      .set('surveyed', surveyedNum);

    return this.http.put(this.basePath + `/api/users` + `/${id}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }


  editvolverestadoBasico(surveyedNum: any, id: number) {

    const body = new HttpParams()
      .set('surveyed', surveyedNum)
      .set('premium', surveyedNum);

    return this.http.put(this.basePath + `/api/users` + `/${id}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }


  obtenerObhetivos(id: any){
    return this.http.get(this.basePath + `/api/users/${id}/achievements`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }


  agregarObjetivos(objetivos: any, idUser: any) {

    const body = new HttpParams()
      .set('achievement', objetivos)
      .set('user_id', idUser);

    return this.http.post(this.basePath + `/api/achievements`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getaactividadesDiaria(){
    return this.http.get<any>(this.basePath + `/api/dailyactivities?today=1` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }
}
