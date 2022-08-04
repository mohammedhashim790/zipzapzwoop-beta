import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Amplify, API, Auth} from "aws-amplify";
import {aws_exports} from "./aws-exports";
import {StorageHelper} from "./Bloc/Storage/Storage";
import { HomeComponent } from './Views/home/home.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {AppHelper} from "./Bloc/AppHelper";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { VerifyEmailComponent } from './Views/verify-email/verify-email.component';
import { ScheduleTransferComponent } from './Views/schedule-transfer/schedule-transfer.component';
import { TransferSentComponent } from './Views/transfer-sent/transfer-sent.component';
import { TransferUploadingComponent } from './Views/transfer-uploading/transfer-uploading.component';
import {NgCircleProgressModule} from "ng-circle-progress";
import { MapKeyValuePipe } from './Bloc/Pipes/MapKeyValuePipe/map-key-value-pipe.pipe';
import { TransferSelectComponent } from './Views/transfer-select/transfer-select.component';
import {CopyClipboardDirective} from "./Directives/CopyClipboardDirective/copy-clipboard-directive.directive";
import { DownloadTransferComponent } from './Views/download-transfer/download-transfer.component';
import {AppSession} from "./Bloc/Session/Session";
import { TooltipInfoDirective } from './Directives/TooltipInfo/tooltip-info.directive';

Amplify.configure(aws_exports)
Auth.configure(aws_exports);
API.configure(aws_exports)

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VerifyEmailComponent,
    ScheduleTransferComponent,
    TransferSentComponent,
    TransferUploadingComponent,
    MapKeyValuePipe,
    TransferSelectComponent,
    CopyClipboardDirective,
    DownloadTransferComponent,
    TooltipInfoDirective
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      ReactiveFormsModule
    ],
  providers: [StorageHelper,HttpClient,AppSession],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
