import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONTACT_INFO } from '../../portfolio-data';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class ContactComponent implements OnInit {
  contactInfo = CONTACT_INFO;

  constructor() {}

  ngOnInit(): void {}
}
