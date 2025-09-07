import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-poster',
  imports: [CommonModule],
  templateUrl: './view-poster.html',
  styleUrl: './view-poster.css'
})
export class ViewPoster {
  poster: any = null;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // ✅ Get poster ID from URL
    this.http.get(`http://localhost:5000/api/posters/${id}`).subscribe({
      next: (res: any) => {
        this.poster = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load poster';
        this.loading = false;
      }
    });
  }

}
