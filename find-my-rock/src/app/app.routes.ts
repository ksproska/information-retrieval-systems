import { Routes } from '@angular/router';
import {MainPageComponent} from "./components/main-page/main-page.component";
import {SerpComponent} from "./components/serp/serp.component";

export const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'serp', component: SerpComponent},
];
