import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CERTIFICATIONS } from '../../portfolio-data';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.html',
  styleUrls: ['./certifications.css'],
})
export class CertificationsComponent implements OnInit {
  certifications = CERTIFICATIONS;

  constructor() {}

  ngOnInit(): void {}
}
