import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  private apiUrl = `https://api.sendgrid.com/v3/mail/send`;
  private key = environment.key;
  constructor(private http: HttpClient) { }

  sendEmail() {
    const url = this.apiUrl;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.key}`
    });
    const data = {
      personalizations: [{ to: [{ email: 'felipeh2002@gmail.com' }] }],
      from: { email: 'picib@noreplay.co' },
      subject: 'Se inscribio al curso correctamente',
      content: [{ type: 'text/plain', value: 'Se inscribio al curso correctamente' }]
    };
    this.http.post(url, data, { headers }).subscribe(response => {

    });
  }
}
