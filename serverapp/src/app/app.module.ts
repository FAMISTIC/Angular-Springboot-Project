import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports:[BrowserModule, FormsModule, 
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true,
      newestOnTop: false,
      easeTime: 300,
      extendedTimeOut: 1000,
      preventDuplicates: false,
    })
  ],
  providers:[],
})
export class AppModule {}

