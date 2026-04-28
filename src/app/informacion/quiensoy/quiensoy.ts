import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GithubService } from '../github.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiensoy',
  imports: [RouterLink],
  templateUrl: './quiensoy.html',
  styleUrl: './quiensoy.css',
})
export class QuiensoyPage implements OnInit {
  user: any = null;

  constructor(private github: GithubService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.github.getUser('eze433').subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log('error:', err)
    });
  }
}