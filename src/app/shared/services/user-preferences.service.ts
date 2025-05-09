import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface UserInfo {
  name: string;
  email: string;
}

interface HomeLocation {
  city: string;
  country: string;
  lat?: number;
  lon?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly STORAGE_KEY = 'user_preferences';
  private readonly HOME_LOCATION_KEY = 'home_location';
  
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();
  
  private homeLocationSubject = new BehaviorSubject<HomeLocation | null>(null);
  public homeLocation$ = this.homeLocationSubject.asObservable();

  constructor() {
    this.loadUserInfo();
    this.loadHomeLocation();
  }

  private loadUserInfo(): void {
    const storedInfo = localStorage.getItem(this.STORAGE_KEY);
    if (storedInfo) {
      this.userInfoSubject.next(JSON.parse(storedInfo));
    }
  }
  
  private loadHomeLocation(): void {
    const storedLocation = localStorage.getItem(this.HOME_LOCATION_KEY);
    if (storedLocation) {
      this.homeLocationSubject.next(JSON.parse(storedLocation));
    }
  }

  saveUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userInfo));
    this.userInfoSubject.next(userInfo);
  }

  getUserInfo(): UserInfo | null {
    const storedInfo = localStorage.getItem(this.STORAGE_KEY);
    return storedInfo ? JSON.parse(storedInfo) : null;
  }

  hasUserInfo(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  saveHomeLocation(location: HomeLocation): void {
    localStorage.setItem(this.HOME_LOCATION_KEY, JSON.stringify(location));
    this.homeLocationSubject.next(location);
  }
  
  getHomeLocation(): HomeLocation | null {
    const storedLocation = localStorage.getItem(this.HOME_LOCATION_KEY);
    return storedLocation ? JSON.parse(storedLocation) : null;
  }
  
  hasHomeLocation(): boolean {
    return !!localStorage.getItem(this.HOME_LOCATION_KEY);
  }
}
