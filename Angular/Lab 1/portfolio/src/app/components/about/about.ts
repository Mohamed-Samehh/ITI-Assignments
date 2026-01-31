import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Education } from '../../models/portfolio.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class AboutComponent implements OnInit {
  education: Education[] = [];

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.education = this.portfolioService.getEducation();
  }

  getLogoWidth(institution: string): number {
    return institution.includes('London South Bank') ? 48 : 40;
  }

  getLogoHeight(institution: string): number {
    return institution.includes('London South Bank') ? 56 : 48;
  }
}
