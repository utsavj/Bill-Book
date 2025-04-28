import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpansionPanelComponent } from "./expansion-panel/expansion-panel/expansion-panel.component";
import { MatIconModule } from '@angular/material/icon';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExpansionPanelComponent, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bill-book';
  public items = 1;
  public itemsArray: quotation[] = [];
  public totalCost = 0;
  readonly dialog = inject(MatDialog);

  constructor() {
    this.generateExpansionPanel(this.items);
  }

  public generateExpansionPanel(size: number) {
    this.itemsArray = Array(size).fill(0);
  }

  public addPanel()
  {
    this.items++;
    this.generateExpansionPanel(this.items);
  }

  public deletePanel() {
    this.items--;
    this.generateExpansionPanel(this.items);
  }

  public setItem(item: quotation, index: number) {
    this.itemsArray[index] = item;
    this.calculateBillAmount();
  }

  public calculateBillAmount() {
    this.itemsArray.forEach(item => {
      this.totalCost += item.total;
    });
  }

  public openQuotation(): void {
    const dialogRef = this.dialog.open(TablePopupComponent, {
      data: this.itemsArray,
      height: "70vh"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
