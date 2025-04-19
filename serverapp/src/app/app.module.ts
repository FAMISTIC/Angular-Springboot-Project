import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AppComponent } from "./app.component";
import { NotificationModule } from "./notification.module";

@NgModule({
  imports:[BrowserModule, FormsModule, NotificationModule],
  providers:[],
})
export class AppModule {}

