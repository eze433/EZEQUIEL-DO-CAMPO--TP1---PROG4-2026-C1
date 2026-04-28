import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github.service';

@Component({
  selector: 'app-quiensoy',
  imports: [],
  templateUrl: './quiensoy.html',
  styleUrl: './quiensoy.css',
})

export class QuiensoyPage implements OnInit {
  user: any = null;

  constructor(private github: GithubService) {}

ngOnInit() {
  this.github.getUser('eze433').subscribe({next: (data) => {
      console.log('data:', data);
      this.user = data;
    },
    error: (err) => {
      console.log('error:', err);
    }
  });
}
}