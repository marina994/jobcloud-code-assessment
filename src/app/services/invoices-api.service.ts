import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceDto } from '../models/job-ad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesApiService {
  private url = 'http://localhost:3000/invoices';

  constructor(private http: HttpClient) {}

  getInvoices() {
    return this.http.get(this.url);
  }
  createInvoice(invoice: InvoiceDto): Observable<Object> {
    let today = new Date();
    return this.http.post(this.url, {...invoice, createdAt: today, updatedAt: today});
  }

  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
