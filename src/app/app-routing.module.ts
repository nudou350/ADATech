import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ToDoComponent } from './home/to-do/to-do.component';
import { LoginResolver } from './services/login.resolver';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: ToDoComponent,
    resolve: {
      jwt : LoginResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    LoginResolver
  ]
})
export class AppRoutingModule { }
