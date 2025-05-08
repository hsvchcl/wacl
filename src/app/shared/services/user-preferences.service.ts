import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface UserInfo {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly STORAGE_KEY = 'user_preferences';
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor() {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const storedInfo = localStorage.getItem(this.STORAGE_KEY);
    if (storedInfo) {
      this.userInfoSubject.next(JSON.parse(storedInfo));
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
}
