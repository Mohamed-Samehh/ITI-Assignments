import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EXPERIENCES } from '../../portfolio-data';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrls: ['./experience.css'],
})
export class ExperienceComponent implements OnInit {
  experiences = EXPERIENCES;

  constructor() {}

  ngOnInit(): void {}
}
