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
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        return{dataState: DataState.LOADED_STATE, appData: {...response, data: {servers: response.data.servers.reverse()}}}
        }),
        startWith({dataState: DataState.LOADING_STATE}),
        catchError((error: string)=>{
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }
  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
    .pipe(
      map(response => {
        this.toastr.info(`Pinged ${ipAddress}`, 'Ping Success');
        const index = this.dataSubject.value.data.servers.findIndex(server => server.id === response.data.server.id);
        this.dataSubject.value.data.servers[index] = response.data.server;
        this.filterSubject.next('');
        return{dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.toastr.error(`Ping failed for ${ipAddress}`, 'Ping Error');
          this.filterSubject.next('');
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
        document.getElementById('closeModal').click();
        this.isLoading.next(false);
        serverForm.resetForm({status: this.Status.SERVER_DOWN});
        this.toastr.success('Server saved successfully!', 'Success');
        return{dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.toastr.error('Failed to save server', 'Error');
          this.isLoading.next(false);
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }
  filterServers(status: Status): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
    .pipe(
      map(response => {
        return{dataState: DataState.LOADED_STATE, appData: response};
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string)=>{
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
    .pipe(
      map(response => {
        this.toastr.warning(`${server.name} deleted`, 'Server Deleted');
        this.dataSubject.next(
          { ...response, data:
            {servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id)}
          }
        );
        return{dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.toastr.error('Failed to delete server', 'Error');
          return of({ dataState: DataState.ERROR_STATE, error})
        })
      );
  }

  printReport(): void {
    //window.print();
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

