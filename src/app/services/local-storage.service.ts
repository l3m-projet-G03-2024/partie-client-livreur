import { Injectable } from '@angular/core';
import { PreviousStep } from '../utils/types/previous-step.type';
import { Tournee } from '../utils/types/tournee.type';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Set a value in local storage
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Get a value from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }

  getPreviousStep(): PreviousStep {
    return JSON.parse(this.getItem("previous-step") as string) as PreviousStep;
  }

  getTournee(): Tournee {
    return JSON.parse(this.getItem("tournee") as string) as Tournee;
  }
}
