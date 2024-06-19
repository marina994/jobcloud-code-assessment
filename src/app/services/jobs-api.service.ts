import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobAdDto } from '../models/job-ad';

@Injectable({
  providedIn: 'root'
})
export class JobsApiService {
  private url = 'http://localhost:3000/jobs';

  constructor(private http: HttpClient) { }
  
  getJobAds(): Observable<JobAdDto[]> {
    return this.http.get<JobAdDto[]>(this.url);
  }

  createJobAd(jobAd: JobAdDto): Observable<Object> {
    const now = new Date();
    return this.http.post(this.url, {...jobAd, createdAt: now, updatedAt: now});
  }

  deleteJobAd(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  updateJobAd(jobAd: JobAdDto): Observable<JobAdDto> {
    const url = `${this.url}/${jobAd.id}`;
    return this.http.put<JobAdDto>(url, {...jobAd, updatedAt: new Date()});
  }
}
