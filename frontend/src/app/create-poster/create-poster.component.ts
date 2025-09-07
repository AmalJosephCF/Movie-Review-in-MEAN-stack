import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, Poster } from '../user.services';

@Component({
  selector: 'app-create-poster',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-poster.html',
  styleUrl: './create-poster.css'
})
export class CreatePosterComponent {
  poster: Partial<Poster> = {
    title: '',
    movieName: '',
    category: 'Action',
    posterImage: '',
    review: '',
    rating: 5
  };

  categories = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 
    'Romance', 'Thriller', 'Documentary', 'Animation', 'Other'
  ];

  loading = false;
  error = '';
  success = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.userService.createPoster(this.poster as any).subscribe({
      next: (response) => {
        this.success = response.msg;
        this.loading = false;
        
        // Redirect to user dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/userlogin']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.msg || 'Failed to create poster';
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.poster.title?.trim()) {
      this.error = 'Title is required';
      return false;
    }
    if (!this.poster.movieName?.trim()) {
      this.error = 'Movie name is required';
      return false;
    }
    if (!this.poster.posterImage?.trim()) {
      this.error = 'Poster image URL is required';
      return false;
    }
    if (!this.poster.review?.trim() || this.poster.review!.length < 10) {
      this.error = 'Review must be at least 10 characters';
      return false;
    }
    if (!this.poster.rating || this.poster.rating < 1 || this.poster.rating > 5) {
      this.error = 'Rating must be between 1 and 5';
      return false;
    }
    return true;
  }

  onImageUrlChange() {
    // Clear any previous errors
    this.error = '';
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? '★' : '☆');
  }

  setRating(rating: number) {
    this.poster.rating = rating;
  }
}
