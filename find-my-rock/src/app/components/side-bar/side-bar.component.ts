import {Component, Input, OnInit} from '@angular/core';
import {Route} from "../../models/route";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit{

  @Input() route!: Route;
  @Input() id!: string;
  @Input() colorDifficulty!: string;
  @Input() types!: string;
  ngOnInit(): void {
  }
}
