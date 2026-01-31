import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ContactInfo } from '../../models/portfolio.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class ContactComponent implements OnInit {
  contactInfo!: ContactInfo;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.contactInfo = this.portfolioService.getContactInfo();
  }
}
