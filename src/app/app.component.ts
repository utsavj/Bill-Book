import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpansionPanelComponent } from "./expansion-panel/expansion-panel/expansion-panel.component";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TablePopupComponent } from './table-popup/table-popup/table-popup.component';
import { quotation } from './quotation-interface';
import { GetValuesService } from './services/get-values.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExpansionPanelComponent, MatIconModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bill-book';
  public items = 1;
  public itemsArray: quotation[] = [];
  public totalCost = 0;
  readonly dialog = inject(MatDialog);

  constructor(public sheetsService: GetValuesService) {
    this.generateExpansionPanel(this.items);
    this.sheetsService.getParsedSize();
    this.sheetsService.getParsedPaper();
  }

  public initializeQuotaion() {
    return {
      GUID: uuidv4(),
      name: "",
      quantity: 0,
      size: 0,
      dptr: 0,
      printedPages: 0,
      pages: 0,
      column: 0,
      side: 0,
      plate: "",
      bind: "",
      numCounter: 0,
      paper1: "",
      paper2: "",
      paper3: "",
      paper4: "",
      total: 0,
      perBook: 0
    };
  }

  public generateExpansionPanel(size: number) {
    let initQuote: quotation = this.initializeQuotaion();
    this.itemsArray = Array(size).fill(initQuote);
    this.calculateBillAmount();
  }

  public addPanel(){
    this.itemsArray.push(this.initializeQuotaion());
    this.calculateBillAmount();
  }

  public setItem(item: quotation, index: number) {
    this.itemsArray[index] = item;
    this.calculateBillAmount();
  }

  public calculateBillAmount() {
    let cost = 0
    this.itemsArray.forEach(item => {
      cost += item.total;
    });
    this.totalCost = cost;
  }

  public openQuotation(): void {
    const dialogRef = this.dialog.open(TablePopupComponent, {
      data: {itemsArray: this.itemsArray, totalCost: this.totalCost},
      height: "70vh"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
