import { Component, Output, EventEmitter } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BIN, DPTR, PAPER, PARTY, PLATE, SIZE } from '../../values';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { quotation } from '../../quotation-interface';

@Component({
  selector: 'app-expansion-panel',
  standalone: true,
  providers: [
    provideNativeDateAdapter()
  ],
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss'
})
export class ExpansionPanelComponent {

  readonly date = new FormControl('', []);
  readonly name = new FormControl('', []);
  readonly paperQuantity = new FormControl('', []);
  readonly bookQuantity = new FormControl('', []);
  readonly card = new FormControl('', []);
  readonly pritedPages = new FormControl('', []);
  readonly pages = new FormControl('', []);
  readonly fbcol = new FormControl('', []);
  readonly selfBack = new FormControl('', []);
  readonly numCou = new FormControl('', []);
  public itemTotal = 0;
  public pSize = SIZE;
  public selectedSize = 3;
  public plateSize = PLATE;
  public selectedPlate: any;
  public bin = BIN
  public selectedBin: any;
  public paper = PAPER;
  public selectedPaper1: any;
  public selectedPaper2: any;
  public selectedPaper3: any;
  public selectedPaper4: any;
  public party = PARTY;
  public selectedParty: any;
  public selectedDPTR: any;
  public dptr = DPTR;
  public itemQuotation: quotation = {
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

  @Output() itemCalculationEvent = new EventEmitter<quotation>();

  constructor() {
  }

  public calculateItemCost() {
    this.calculateQuantity();
    this.calculatePrint();
    this.calculateNumber();
    this.calculatePlate();
    this.calculateBind();
    this.calculatePaper();
    this.calculateTotal();
  }

  public calculateQuantity() {

  }

  public calculatePrint() {

  }

  public calculateNumber() {

  }

  public calculatePlate() {

  }

  public calculateBind() {

  }

  public calculatePaper() {

  }

  public calculateTotal() {
    this.itemCalculationEvent.emit(this.itemQuotation)
  }

}
