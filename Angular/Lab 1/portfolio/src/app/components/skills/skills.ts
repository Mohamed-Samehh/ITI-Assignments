import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SKILLS } from '../../portfolio-data';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.css'],
})
export class SkillsComponent implements OnInit {
  skills = SKILLS;

  constructor() {}

  ngOnInit(): void {}
}
