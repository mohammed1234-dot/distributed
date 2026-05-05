import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from './../services/data.service';

interface Task {
  id: number;
  title: string;
  desc: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'inprogress' | 'done';
  owner: string;
  sharedWith: string[];
  created: Date;
}

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {

  userName: string = 'Guest';
  userEmail: string = '';

  newTask: any = { title: '', desc: '', priority: 'medium' };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const user = this.dataService.getCurrentUser();

    if (user && user.email) {
      this.userName = user.username || user.fullName || user.email.split('@')[0];
      this.userEmail = user.email;
    } else {
      this.userName = 'Guest';
      this.userEmail = '';
    }
  }

  // Getters used in HTML
  get myVisibleTasks() {
    return this.dataService.getVisibleTasksForUser(this.userEmail);
  }

  get todoTasks() {
    return this.myVisibleTasks.filter((t: Task) => t.status === 'todo');
  }

  get inProgressTasks() {
    return this.myVisibleTasks.filter((t: Task) => t.status === 'inprogress');
  }

  get doneTasks() {
    return this.myVisibleTasks.filter((t: Task) => t.status === 'done');
  }

  addTask() {
    if (!this.newTask.title.trim() || !this.userEmail) {
      alert("Please login to add tasks!");
      return;
    }

    const taskToAdd: Task = {
      id: Date.now(),
      title: this.newTask.title,
      desc: this.newTask.desc || '',
      priority: this.newTask.priority,
      status: 'todo',
      owner: this.userEmail,
      sharedWith: [],
      created: new Date()
    };

    this.dataService.addTask(taskToAdd);
    this.newTask.title = '';
    this.newTask.desc = '';
  }

  shareTask(task: Task, friendEmail: string) {
    if (!friendEmail || friendEmail === this.userEmail) return;
    
    const success = this.dataService.shareTask(task.id, friendEmail.trim());
    if (success) {
      alert(`Shared with ${friendEmail}`);
    } else {
      alert('Failed to share');
    }
  }

  moveTask(task: Task, status: 'todo' | 'inprogress' | 'done') {
    this.dataService.updateTaskStatus(task.id, status);
  }

  deleteTask(id: number) {
    this.dataService.deleteTask(id);
  }
}