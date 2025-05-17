import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { quotation } from '../../quotation-interface';

@Component({
  selector: 'app-table-popup',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './table-popup.component.html',
  styleUrl: './table-popup.component.scss'
})
export class TablePopupComponent {
  displayedColumns: string[] = ['name', 'quantity', 'size', 'dptr', 'printedPages', 'pages', 'column', 'side', 'plate', 'bind', 'numCounter', 'paper1', 'paper2', 'paper3', 'paper4', 'perBook', 'total'];
  readonly dialogRef = inject(MatDialogRef<TablePopupComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  public totalCost = this.data.totalCost;
  public itemsArray: quotation[] = this.data.itemsArray;

  constructor() {

  }

  public downloadPDF() {
    let printContents, popupWin;
    printContents = document?.getElementById("quotation-table")?.innerHTML;
    console.log(printContents)
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin?.document.open();
    popupWin?.document.write(`
    <html>
    <head>
      <title>Quotation</title>
    </head>
    <style>
      table, th, td {
        border-bottom: 1px solid black;
        border-collapse: collapse;
      }
      th, td {
        padding: 10px;
      }
    </style>
    <body onload="window.print();window.close()"><table class="table table-bordered">${printContents}</table></body>
    </html>`
    );
    popupWin?.document.close();
  }
}
