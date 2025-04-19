import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left', // closest to left-bottom
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true,
      newestOnTop: false, // similar to stacking control
      easeTime: 300,
      extendedTimeOut: 1000,
      preventDuplicates: false,
      // Note: ngx-toastr has limited animation control
    })
  ],
  exports: [ToastrModule]
})
export class NotificationModule {}
