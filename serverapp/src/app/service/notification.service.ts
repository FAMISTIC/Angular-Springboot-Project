import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private readonly toaster: ToastrService;
  constructor(private toastr: ToastrService) { this.toaster = toastr;}
  onDefault(message: string): void{
    this.toastr.show(Type.DEFAULT, message);
  }
  onSuccess(message: string): void{
    this.toastr.success(Type.SUCCESS, message);
  }
  onInfo(message: string): void{
    this.toastr.info(Type.INFO, message);
  }
  onWarning(message: string): void{
    this.toastr.warning(Type.WARNING, message);
  }
  onERROR(message: string): void{
    this.toastr.error(Type.ERROR, message);
  }
}

enum Type{
   DEFAULT = 'default',
   INFO = 'info',
   SUCCESS = 'success',
   WARNING = 'warning',
   ERROR = 'error'
  }
