import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private API_URL = 'http://localhost:8080/task-manager-api/';
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

  // ====================== AUTH ======================

  register(user: any): Observable<any> {
    return this.http.post(this.API_URL + 'register.php', user).pipe(
      tap(res => console.log('Register response:', res))
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.API_URL + 'login.php', { email, password }).pipe(
      tap(res => console.log('Login response:', res))
    );
  }

  // ====================== CURRENT USER (SSR Safe) ======================

  setCurrentUser(user: any) {
    this.currentUser = user;
    this.saveToLocalStorage('currentUser', user);
  }

  getCurrentUser() {
    if (this.currentUser) return this.currentUser;

    const user = this.getFromLocalStorage('currentUser');
    if (user) this.currentUser = user;
    return user;
  }

  // ====================== TASKS (SSR Safe) ======================

  private saveToLocalStorage(key: string, data: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  private getFromLocalStorage(key: string): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  getAllTasks(): any[] {
    return this.getFromLocalStorage('allTasks') || [];
  }

  saveAllTasks(tasks: any[]) {
    this.saveToLocalStorage('allTasks', tasks);
  }

getVisibleTasksForUser(email: string): any[] {
  if (!email) return [];

  const allTasks = this.getAllTasks();
  
  return allTasks.filter(task => {
    const ownerMatch = task.owner === email;
    const sharedMatch = task.sharedWith && 
                       task.sharedWith.some((e: string) => 
                         e.toLowerCase() === email.toLowerCase()
                       );
    
    return ownerMatch || sharedMatch;
  });
}

  addTask(task: any) {
    const allTasks = this.getAllTasks();
    const newTask = {
      ...task,
      id: Date.now(),
      sharedWith: task.sharedWith || []
    };

    allTasks.push(newTask);
    this.saveAllTasks(allTasks);
    return newTask;
  }

shareTask(taskId: number, friendEmail: string): boolean {
  if (!friendEmail) return false;

  const allTasks = this.getAllTasks();
  const task = allTasks.find(t => t.id === taskId);

  if (!task) return false;

  if (!task.sharedWith) {
    task.sharedWith = [];
  }

  // Avoid duplicate shares
  if (!task.sharedWith.includes(friendEmail)) {
    task.sharedWith.push(friendEmail);
    this.saveAllTasks(allTasks);
    console.log(`Task ${taskId} shared with ${friendEmail}`);
    return true;
  }

  return false;
}

  updateTaskStatus(taskId: number, newStatus: string) {
    const allTasks = this.getAllTasks();
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.saveAllTasks(allTasks);
    }
  }

  deleteTask(taskId: number) {
    let allTasks = this.getAllTasks();
    allTasks = allTasks.filter(t => t.id !== taskId);
    this.saveAllTasks(allTasks);
  }

  logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
  }
}