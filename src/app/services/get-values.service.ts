import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { environment } from "../../environments/environment";

/**
 * @description
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class GetValuesService {

  private apiKey = environment.publicApiKey;
  private SPREADSHEET_ID = "1vr4zcpm_UCOhvXA1UhDNSVUEEAXMsKtLD0IR4MgVp68";
  private sizeSheet = 'Size';
  private paperSheet = "Paper"

  constructor(
    private http: HttpClient
  ) {

  }

  public getSize() {
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${this.sizeSheet}?key=${this.apiKey}`;
    console.log(apiUrl);

    return this.http.get<any>(apiUrl);
  }

  public getPaper() {
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${this.paperSheet}?key=${this.apiKey}`;

    return this.http.get<any>(apiUrl);
  }

}
