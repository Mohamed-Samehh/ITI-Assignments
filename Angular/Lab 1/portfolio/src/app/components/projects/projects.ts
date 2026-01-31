import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from '../../portfolio-data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
})
export class ProjectsComponent implements OnInit {
  projects = PROJECTS;

  constructor() {}

  ngOnInit(): void {}
}
