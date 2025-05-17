import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";

/**
 * @description
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class GetValuesService {

  private apiKey = environment.publicApiKey;
  private SPREADSHEET_ID = environment.spreadsheetId;
  private sizeSheet = 'Size';
  private paperSheet = "Paper";
  public sizeData: any[] = [];
  public paperData: any[] = [];
  public sizeDataObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public paperDataObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

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

  public getParsedSize() {
    this.getSize().subscribe((response: any) => {
      const rawData = response.values;
      this.sizeData = this.parseSheetData(rawData);
      this.sizeDataObservable.next(this.sizeData);
      console.log(this.sizeData);
    });
  }

  public getParsedPaper() {
    this.getPaper().subscribe((response: any) => {
      const rawData = response.values;
      this.paperData = this.parseSheetData(rawData);
      this.paperDataObservable.next(this.paperData);
      console.log(this.paperData);
    });
  }

  public parseSheetData(sheetValues: string[][]): Record<string, string>[] {
    if (!sheetValues || sheetValues.length < 2) return [];

    const headers = sheetValues[0];
    const rows = sheetValues.slice(1);

    return rows.map(row => {
      const rowObject: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowObject[header] = row[index] || '';
      });
      return rowObject;
    });
  }

}
