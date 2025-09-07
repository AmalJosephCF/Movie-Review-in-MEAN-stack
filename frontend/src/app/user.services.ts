import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id?: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user'; // assigned by backend
  profilePhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Poster {
  _id?: string;
  title: string;
  movieName: string;
  category: string;
  posterImage: string;
  review: string;
  rating: number;
  author: User;
  isApproved: boolean;
  approvedBy?: User;
  approvedAt?: string;
  comments: Comment[];
  likes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id?: string;
  content: string;
  author: User;
  poster: string;
  likes: string[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/auth'; // 🚀 backend base URL
  private posterUrl = 'http://localhost:5000/api/posters'; // 🎬 posters base URL

  constructor(private http: HttpClient) {}

  // Helper: get auth headers with JWT
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // assuming you store JWT in localStorage
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ================================
  // 🔑 AUTH SERVICES
  // ================================
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  checkUsername(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(
      `${this.apiUrl}/check-username?username=${username}`
    );
  }

  checkEmail(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(
      `${this.apiUrl}/check-email?email=${email}`
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role }, {
      headers: this.getAuthHeaders()
    });
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  logAllUsers(): void {
    this.getAllUsers().subscribe(
      (res) => {
        console.log("All users from backend:", res);
      },
      (err) => {
        console.error("Error fetching users", err);
      }
    );
  }

  // ================================
  // 🎬 POSTER SERVICES
  // ================================
  getAllPosters(category?: string, page: number = 1): Observable<any> {
    let url = `${this.posterUrl}?page=${page}`;
    if (category && category !== 'All') {
      url += `&category=${category}`;
    }
    return this.http.get(url);
  }

  /** ✅ New: Admin-only - fetch ALL posters (approved + pending) */
  getAllPostersForAdmin(): Observable<Poster[]> {
    return this.http.get<Poster[]>(`${this.posterUrl}/all`, {
      headers: this.getAuthHeaders()
    });
  }

  getPendingPosters(): Observable<Poster[]> {
    return this.http.get<Poster[]>(`${this.posterUrl}/pending`, {
      headers: this.getAuthHeaders()
    });
  }

  getMyPosters(): Observable<Poster[]> {
    return this.http.get<Poster[]>(`${this.posterUrl}/my-posts`, {
      headers: this.getAuthHeaders()
    });
  }

  getPosterById(id: string): Observable<Poster> {
    return this.http.get<Poster>(`${this.posterUrl}/${id}`);
  }

  createPoster(
    poster: Omit<Poster, '_id' | 'author' | 'isApproved' | 'comments' | 'likes' | 'createdAt' | 'updatedAt'>
  ): Observable<any> {
    return this.http.post(`${this.posterUrl}`, poster, {
      headers: this.getAuthHeaders()
    });
  }

  approvePoster(id: string): Observable<any> {
    return this.http.put(`${this.posterUrl}/${id}/approve`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  rejectPoster(id: string): Observable<any> {
    return this.http.put(`${this.posterUrl}/${id}/reject`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  deletePoster(id: string): Observable<any> {
    return this.http.delete(`${this.posterUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ================================
  // 💬 COMMENT SERVICES
  // ================================
  addComment(content: string, posterId: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/comments`, {
      content,
      posterId
    }, {
      headers: this.getAuthHeaders()
    });
  }

  updateComment(id: string, content: string): Observable<any> {
    return this.http.put(`http://localhost:5000/api/comments/${id}`, {
      content
    }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/comments/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  likeComment(id: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/comments/${id}/like`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // ================================
  // 🚪 AUTH HELPERS
  // ================================
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
