import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, map, Observable, switchMap, tap } from 'rxjs';
import { Card } from './models/ICard';
import { CardState } from './services/card.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'ADATech';
  constructor(public translate: TranslateService) {
    translate.addLangs(['pt', 'en']);
    translate.setDefaultLang('en');
  }
}
