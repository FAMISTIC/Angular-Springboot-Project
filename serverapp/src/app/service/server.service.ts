import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly apiUrl = 'http://localhost:9234';

  servers$: Observable<CustomResponse>;
  save$: (server: Server) => Observable<CustomResponse>;
  ping$: (ipAddress: string) => Observable<CustomResponse>;
  delete$: (serverId: number) => Observable<CustomResponse>;
  filter$: (status: Status, response: CustomResponse) => Observable<CustomResponse>;

  constructor(private http: HttpClient) {
    this.servers$ = this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

    this.save$ = (server: Server) =>
      this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
        .pipe(
          tap(console.log),
          catchError(this.handleError)
        );

    this.ping$ = (ipAddress: string) =>
      this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
        .pipe(
          tap(console.log),
          catchError(this.handleError)
        );

    this.delete$ = (serverId: number) =>
      this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
        .pipe(
          tap(console.log),
          catchError(this.handleError)
        );

    this.filter$ = (status: Status, response: CustomResponse) =>
      new Observable<CustomResponse>(
        subscriber => {
          console.log(response);
          subscriber.next(
            status === Status.ALL
              ? { ...response, message: `Servers filtered by ${status} status` }
              : {
                  ...response,
                  message: response.data.servers.filter(server => server.status === status).length > 0
                    ? `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status`
                    : `No servers of ${status} found`,
                  data: {
                    servers: response.data.servers.filter(server => server.status === status)
                  }
                }
          );
          subscriber.complete();
        }
      ).pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(() => new Error(`An error occurred - Error code: ${error.status}`));
  }
}
