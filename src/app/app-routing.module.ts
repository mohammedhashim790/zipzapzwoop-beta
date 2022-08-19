import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./Views/home/home.component";
import {DownloadTransferComponent} from "./Views/download-transfer/download-transfer.component";
import {PolicyViewerComponent} from "./Views/policy-viewer/policy-viewer.component";

const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
  },
  {
    path:':id',
    component:DownloadTransferComponent,
  },
  {
    path:'download',
    component:DownloadTransferComponent,
  },
  {
    path:'file',
    component:DownloadTransferComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
