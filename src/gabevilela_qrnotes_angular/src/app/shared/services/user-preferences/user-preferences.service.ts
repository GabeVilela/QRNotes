import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  isBinPanelExpanded:boolean = false;

  constructor() { }
}
