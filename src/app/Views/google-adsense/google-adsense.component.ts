import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'google-adsense',
  templateUrl: './google-adsense.component.html',
  styleUrls: ['./google-adsense.component.css']
})
export class GoogleAdsenseComponent implements OnInit,AfterViewInit {

  adsbygoogle:any;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    try {
      (this.adsbygoogle = (window as any)['adsbygoogle'] || []).push({});
    } catch (e) {}
    // try {
    //   (window as any)['adsbygoogle'] = ((window as any)['adsbygoogle'] || []).push({});
    //
    // } catch (e) {}
  }

}
