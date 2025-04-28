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
  displayedColumns: string[] = ['jobName', 'date', 'quantity', 'print', 'numbering', 'plate', 'bind', 'paper', 'total'];
  readonly dialogRef = inject(MatDialogRef<TablePopupComponent>);
  readonly data = inject<quotation[]>(MAT_DIALOG_DATA);
  public dataSource = this.data;
  public totalCount: quotation = {
    jobName: '',
    date: '',
    quantity: 0,
    print: 0,
    numbering: 0,
    plate: 0,
    bind: 0,
    paper: 0,
    total: 0
  };

  constructor() {
    this.calculateTotal();
  }

  public calculateTotal() {
    this.totalCount = {
      jobName: "",
      date: "",
      quantity: 0,
      print: this.data.reduce((sum, item) => sum + item.print, 0),
      numbering: this.data.reduce((sum, item) => sum + item.numbering, 0),
      plate: this.data.reduce((sum, item) => sum + item.plate, 0),
      bind: this.data.reduce((sum, item) => sum + item.bind, 0),
      paper: this.data.reduce((sum, item) => sum + item.paper, 0),
      total: this.data.reduce((sum, item) => sum + item.total, 0)
    };
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
