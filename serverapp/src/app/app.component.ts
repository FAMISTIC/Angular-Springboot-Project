import { Component, OnInit } from '@angular/core';
import { ServerService } from './service/server.service';
import { BehaviorSubject, catchError, Observable, of, startWith } from 'rxjs';
import {map } from 'rxjs/operators';
import { CustomResponse } from './interface/custom-response';
import { AppState } from './interface/app-state';
import { DataState } from './enum/data-state.enum';
import { CommonModule, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Status } from './enum/status.enum';
import { Server } from './interface/server';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationService } from './service/notification.service';
//import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ToastrModule,
    CommonModule,
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  /*animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]*/
})

export class AppComponent implements OnInit{
  appState$: Observable<AppState<CustomResponse>>;

  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(
    private serverService: ServerService,
    private toaster: NotificationService
  ){}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
    .pipe(
      map(response => {
        this.toaster.onDefault(response.message);
        this.dataSubject.next(response);
        return{dataState: DataState.LOADED_STATE, appData: {...response, data: {servers: response.data.servers.reverse()}}}
        }),
        startWith({dataState: DataState.LOADING_STATE}),
        catchError((error: string)=>{
          this.toaster.onDefault(error);
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }
  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
    .pipe(
      map(response => {
        const index = this.dataSubject.value.data.servers.findIndex(server => server.id === response.data.server.id);
        this.dataSubject.value.data.servers[index] = response.data.server;
        this.filterSubject.next('');
        this.toaster.onDefault(response.message);
        return{dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.filterSubject.next('');
          this.toaster.onDefault(error);
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data:{ servers:[response.data.server, ...this.dataSubject.value.data.servers]}}
        );
        this.toaster.onDefault(response.message);
        document.getElementById('closeModal').click();
        this.isLoading.next(false);
        serverForm.resetForm({status: this.Status.SERVER_DOWN});
        return{dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.isLoading.next(false);
          this.toaster.onDefault(error);
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }
  filterServers(status: Status): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
    .pipe(
      map(response => {
        this.toaster.onDefault(response.message);
        return{dataState: DataState.LOADED_STATE, appData: response};
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.toaster.onDefault(error);
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          { ...response, data:
            {servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id)}
          }
        );
        this.toaster.onDefault(response.message);
        return{dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.toaster.onDefault(error);
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }

  printReport(): void {
    //window.print();
    this.toaster.onDefault('Report downloaded');
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}

