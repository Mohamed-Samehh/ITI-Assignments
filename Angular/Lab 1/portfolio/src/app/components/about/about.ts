import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EDUCATION } from '../../portfolio-data';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class AboutComponent implements OnInit {
  education = EDUCATION;

  constructor() {}

  ngOnInit(): void {}

  getLogoWidth(institution: string): number {
    return institution.includes('London South Bank') ? 48 : 40;
  }

  getLogoHeight(institution: string): number {
    return institution.includes('London South Bank') ? 56 : 48;
  }
}
