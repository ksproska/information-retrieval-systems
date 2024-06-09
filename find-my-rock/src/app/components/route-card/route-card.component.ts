import {Component, Input, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import {Route} from "../../models/route";
import {RouterLink} from "@angular/router";
import {SideBarComponent} from "../side-bar/side-bar.component";

@Component({
  selector: 'app-route-card',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    SideBarComponent
  ],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.css'
})


export class RouteCardComponent implements OnInit{


  @Input() route!: Route
  @Input() id!: string
  colorDifficulty: string = "color-easiest";
  types: string = "";


  routeTypeMapping: {[key: string]: string} = {
    'type_trad': 'Traditional',
    'type_sport': 'Sport',
    'type_aid': 'Aid',
    'type_ice': 'Ice',
    'type_tr': 'Top Rope',
    'type_boulder': 'Boulder',
    'type_mixed': 'Mixed',
    'type_snow': 'Snow',
    'type_alpine': 'Alpine'
  }

  private readonly levels = ['easiest', 'easy', 'medium', 'hard', 'hardest'];

  map = new Map<string, bigint>

  private readonly gradeMappings: { [key: string]: string } = {
    // XD
    "3rd": 'easiest', "4th": 'easiest', "Easy 5th": 'easy', "5.0": 'easy', "5.1": 'easy',
    "5.2": 'easy', "5.3": 'easy', "5.4": 'easy', "5.5": 'easy', "5.6": 'easy', "5.7": 'easy',
    "5.7+": 'easy', "5.8": 'easy', "5.8-": 'easy', "5.8+": 'easy', "5.9": 'medium', "5.9-": 'medium',
    "5.9+": 'medium', "5.10": 'medium', "5.10-": 'medium', "5.10a": 'medium', "5.10a/b": 'medium',
    "5.10b": 'medium', "5.10b/c": 'medium', "5.10c": 'medium', "5.10c/d": 'medium', "5.10d": 'medium',
    "5.10+": 'medium', "5.11": 'hard', "5.11-": 'hard', "5.11a": 'hard', "5.11a/b": 'hard',
    "5.11b": 'hard', "5.11b/c": 'hard', "5.11c": 'hard', "5.11c/d": 'hard', "5.11d": 'hard',
    "5.11+": 'hard', "5.12": 'hard', "5.12-": 'hard', "5.12a": 'hard', "5.12a/b": 'hard',
    "5.12b": 'hard', "5.12b/c": 'hard', "5.12c": 'hard', "5.12c/d": 'hard', "5.12d": 'hard',
    "5.12+": 'hard', "5.13": 'hardest', "5.13-": 'hardest', "5.13a": 'hardest', "5.13a/b": 'hardest',
    "5.13b": 'hardest', "5.13b/c": 'hardest', "5.13c": 'hardest', "5.13c/d": 'hardest', "5.13d": 'hardest',
    "5.13+": 'hardest', "5.14": 'hardest', "5.14-": 'hardest', "5.14a": 'hardest', "5.14a/b": 'hardest',
    "5.14b": 'hardest', "5.14b/c": 'hardest', "5.14c": 'hardest', "5.14c/d": 'hardest', "5.14d": 'hardest',
    "5.14+": 'hardest', "5.15": 'hardest', "5.15a": 'hardest', "5.15c/d": 'hardest', "5.15d": 'hardest',
    "5.15+": 'hardest', "V-easy": 'easiest', "V0": 'easy', "V0-": 'easy', "V0+": 'easy',
    "V0-1": 'easy', "V1": 'easy', "V1-": 'easy', "V1+": 'easy', "V1-2": 'easy', "V2": 'easy',
    "V2-": 'easy', "V2+": 'easy', "V2-3": 'easy', "V3": 'medium', "V3-": 'medium', "V3+": 'medium',
    "V3-4": 'medium', "V4": 'medium', "V4-": 'medium', "V4+": 'medium', "V4-5": 'medium',
    "V5": 'medium', "V5-": 'medium', "V5+": 'medium', "V5-6": 'medium', "V6": 'hard',
    "V6-": 'hard', "V6+": 'hard', "V6-7": 'hard', "V7": 'hard', "V7-": 'hard', "V7+": 'hard',
    "V7-8": 'hard', "V8": 'hard', "V8-": 'hard', "V8+": 'hard', "V8-9": 'hard', "V9": 'hard',
    "V9-": 'hard', "V9+": 'hard', "V9-10": 'hard', "V10": 'hard', "V10-": 'hard', "V10+": 'hard',
    "V10-11": 'hard', "V11": 'hardest', "V11-": 'hardest', "V11+": 'hardest', "V11-12": 'hardest',
    "V12": 'hardest', "V12-": 'hardest', "V12+": 'hardest', "V12-13": 'hardest', "V13": 'hardest',
    "V13-": 'hardest', "V13+": 'hardest', "V13-14": 'hardest', "V14": 'hardest', "V14+": 'hardest',
    "V14-15": 'hardest', "V15": 'hardest', "V16": 'hardest', "V16-": 'hardest', "V17": 'hardest', "V?": 'hardest'
  };

  ngOnInit(): void {
      this.updateDifficulty()
      this.types = this.checkRouteTypes();
    }
  checkRouteTypes(): string{
    const routeType = Object.keys(this.routeTypeMapping)
    return routeType
      .filter(type => this.route[type as keyof Route])
      .map(type => this.routeTypeMapping[type])
      .join(", ")
  }

  updateDifficulty(): void {
    const grades = [
      this.route.grade_YDS,
      this.route.grade_French,
      this.route.grade_Ewbanks,
      this.route.grade_UIAA,
      this.route.grade_ZA,
      this.route.grade_British
    ];

    let highestDifficulty = 'easiest';

    for (const grade of grades) {
      if (grade) {
        const currentDifficulty = this.getDifficultyLevel(grade);
        highestDifficulty = this.compareDifficultyLevels(highestDifficulty, currentDifficulty);
      }
    }

    this.colorDifficulty = highestDifficulty;
  }

  getDifficultyLevel(grade: string): string {
    return this.gradeMappings[grade] || 'easiest';
  }

  compareDifficultyLevels(difficulty1: string, difficulty2: string): string {
    return "color-".concat(this.levels.indexOf(difficulty1) > this.levels.indexOf(difficulty2) ? difficulty1 : difficulty2)
  }
}
