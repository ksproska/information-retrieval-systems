import {Component, Input, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import {Route} from "../../models/route";

@Component({
  selector: 'app-route-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.css'
})


export class RouteCardComponent implements OnInit{
  @Input() route!: Route
  colorDifficulty: string = "color-easiest";

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

  ngOnInit(): void {
      this.updateDifficulty()
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
    if (!grade) return 'easiest';

    if (grade.includes('5.')) {
      return 'medium';
    } else if (grade.includes('6.')) {
      return 'hard';
    } else if (grade.includes('7.')) {
      return 'hardest';
    } else {
      return 'easy';
    }
  }

  compareDifficultyLevels(difficulty1: string, difficulty2: string): string {
    const levels = ['easiest', 'easy', 'medium', 'hard', 'hardest'];
    return "color-".concat(levels.indexOf(difficulty1) > levels.indexOf(difficulty2) ? difficulty1 : difficulty2)
  }
}
