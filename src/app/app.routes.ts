import { LayoutComponent } from './layout/layout.component';
import { Routes } from '@angular/router';
import { HomeComponentComponent } from './home-component/home-component.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { SignupComponent } from './signup/signup.component';
export const routes: Routes = [
  { path: '', component: HomeComponentComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponentComponent, pathMatch: 'full' },

  { path: 'sign-up', component: SignupComponent },

  {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: 'todo', component: ToDoListComponent },
      { path: '', redirectTo: 'todo', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'home' }
];