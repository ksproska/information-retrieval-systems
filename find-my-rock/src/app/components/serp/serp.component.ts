import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-serp',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './serp.component.html',
  styleUrl: './serp.component.css'
})
export class SerpComponent {

}
