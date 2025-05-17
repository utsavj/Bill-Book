import { Component, Output, EventEmitter, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BIN, DPTR, NUMBERING, PAPER, PARTY, PLATE, SIZE } from '../../values';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { quotation } from '../../quotation-interface';
import { GetValuesService } from '../../services/get-values.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';

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
    MatCheckboxModule,
    CommonModule
  ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss'
})
export class ExpansionPanelComponent {

  readonly date = new FormControl('', []);
  readonly name = new FormControl('', []);
  readonly paperQuantity = new FormControl('', []);
  readonly bookQuantity = new FormControl('', []);
  readonly pritedPages = new FormControl('', []);
  readonly pages = new FormControl('', []);
  readonly fbcol = new FormControl('', []);
  readonly selfBack = new FormControl('', []);
  readonly numCounter = new FormControl('', []);
  readonly side = new FormControl('', []);
  readonly orderForm = new FormGroup({
    date: this.date,
    name: this.name,
    paperQuantity: this.paperQuantity,
    bookQuantity: this.bookQuantity,
    pritedPages: this.pritedPages,
    pages: this.pages,
    fbcol: this.fbcol,
    selfBack: this.selfBack,
    numCounter: this.numCounter,
    side: this.side
  });
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
  public numbering = NUMBERING;
  public sizeData: any;
  public paperData: any;
  public itemQuotation: quotation = {
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

  @Output() itemCalculationEvent = new EventEmitter<quotation>();

  constructor(public sheetsService: GetValuesService) {
  }

  ngAfterViewInit(): void {
    this.sheetsService.sizeDataObservable.subscribe((data: any) => {
      this.sizeData = data;
    });
    this.sheetsService.paperDataObservable.subscribe((data: any) => {
      this.paperData = data;
    });

    this.orderForm.valueChanges
      .subscribe(value => {
        if (this.orderForm.dirty) {
          this.calculateAndEmitItemQuotation();
        }
      });

    this.itemCalculationEvent.emit(this.itemQuotation);
  }

  public calculateAndEmitItemQuotation() {
    console.log("Yes");
    let itemTotal =
    this.calculatePrint() +
    this.calculateDe() +
    this.calculatePlate() +
    this.calculateBind() +
    this.calculatePaper() +
    this.calculateNumberRs();
    console.log(itemTotal);

    console.log("Print: " + this.calculatePrint());
    console.log("De: " + this.calculateDe());
    console.log("Plate: " + this.calculatePlate());
    console.log("Bind: " + this.calculateBind());
    console.log("Paper: " + this.calculatePaper());
    console.log("Number Rs: " + this.calculateNumberRs());
    this.generateItemQuotationAndEmit(itemTotal);
  }

  public calculateQuantity() {
    return (this.selectedSize === 16)
    ? (Number(this.bookQuantity.value) * Number(this.pages.value) * Number(this.pritedPages.value) * Number(this.side.value)) / 4
    : (this.selectedSize < 7)
      ? (Number(this.bookQuantity.value) * Number(this.pages.value) * Number(this.pritedPages.value) * Number(this.side.value)) / 1
      : (Number(this.bookQuantity.value) * Number(this.pages.value) * Number(this.pritedPages.value) * Number(this.side.value)) / 2;
  }

  public calculatePrint(): number {
    let quantityNumber = this.calculateQuantity();
    const quantityRounded0 = Math.round(quantityNumber / 1000);
    const quantityRounded1 = Math.round((quantityNumber / 1000) * 10) / 10;

    const baseValue = quantityRounded0 < quantityRounded1
      ? quantityRounded0 + 1
      : quantityRounded0;

    return baseValue * Number(this.fbcol.value) * 100;
  }

  public calculateDe(): number {
    return Number(this.side.value) * 80;
  }

  public calculateNumberRs(): number {
    return Number(this.numCounter.value) > 0
      ? Math.round((Number(this.bookQuantity.value) * this.selectedDPTR * Number(this.pages.value)) / 1000 * 10) / 10
        * this.numbering
        * Number(this.numCounter.value)
      : 0;
  }

  public calculatePlate() {
    switch(this.selectedPlate) {
      case "PS":
        return Number(this.side.value) * Number(this.fbcol.value) * 80;
      case "Master":
        return Number(this.side.value) * Number(this.fbcol.value) * 30;
      default:
        return 0;
    }
  }

  public calculateBind() {
    let result: number = 0;

    if (this.selectedBin === "None") {
      result = 0;
    } else if (this.selectedBin === "Paku") {

      this.sizeData.forEach((item: any) => {
        result = Number(item.Size) == Number(this.selectedSize) ? Number(item.Paku) * Number(this.bookQuantity.value) : result;
      });

    } else if (this.selectedBin === "GumPad") {
      this.sizeData.forEach((item: any) => {
        result = Number(item.Size) == Number(this.selectedSize) ? Number(item.GumPad) * Number(this.bookQuantity.value) : result;
      });
    }

    return result;
  }

  public calculatePaper(): number {
    console.log("Paper1: " + this.calculatePaper1());
    console.log("Paper2: " + this.calculatePaper2());
    console.log("Paper3: " + this.calculatePaper3());
    console.log("Paper4: " + this.calculatePaper4());
    console.log("Total Paper: " + this.calculatePaper1() + this.calculatePaper2() + this.calculatePaper3() + this.calculatePaper4());
    return this.calculatePaper1() + this.calculatePaper2() + this.calculatePaper3() + this.calculatePaper4();
  }

  public calculatePaper1(): number {
    let result: number = 0;

    // Convert relevant variables to numbers if they aren't already
    const pagesNumber = Number(this.pages.value);
    const bookQuantityNumber = Number(this.bookQuantity.value);
    const selectedSizeNumber = Number(this.selectedSize);

    if (this.selectedPaper1 === "18.6 Kg.") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "7.4 White") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "Colour") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "Chalu") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "A4") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "FS") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "Ex. Bond") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "Alabaster") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "S.S.") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper1 === "Carbonless") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper1 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else {
        result = 0;
    }

    return result;
  }

  public calculatePaper2(): number {
    let result: number = 0;

    if (this.selectedDPTR < 2)
      return result;

    // Convert relevant variables to numbers if they aren't already
    const pagesNumber = Number(this.pages.value);
    const bookQuantityNumber = Number(this.bookQuantity.value);
    const selectedSizeNumber = Number(this.selectedSize);

    if (this.selectedPaper2 === "18.6 Kg.") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "7.4 White") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "Colour") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "Chalu") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "A4") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "FS") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "Ex. Bond") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "Alabaster") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "S.S.") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper2 === "Carbonless") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper2 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else {
        result = 0;
    }

    return result;
  }

  public calculatePaper3(): number {
    let result: number = 0;

    if (this.selectedDPTR < 3)
      return result;

    // Convert relevant variables to numbers if they aren't already
    const pagesNumber = Number(this.pages.value);
    const bookQuantityNumber = Number(this.bookQuantity.value);
    const selectedSizeNumber = Number(this.selectedSize);

    if (this.selectedPaper3 === "18.6 Kg.") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "7.4 White") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "Colour") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "Chalu") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "A4") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "FS") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "Ex. Bond") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "Alabaster") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "S.S.") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper3 === "Carbonless") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper3 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else {
        result = 0;
    }

    return result;
  }

  public calculatePaper4(): number {
    let result: number = 0;

    if (this.selectedDPTR < 4)
      return result;

    // Convert relevant variables to numbers if they aren't already
    const pagesNumber = Number(this.pages.value);
    const bookQuantityNumber = Number(this.bookQuantity.value);
    const selectedSizeNumber = Number(this.selectedSize);

    if (this.selectedPaper4 === "18.6 Kg.") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "7.4 White") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "Colour") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "Chalu") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 480) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "A4") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "FS") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "Ex. Bond") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "Alabaster") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "S.S.") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else if (this.selectedPaper4 === "Carbonless") {
      this.paperData.forEach((item: any) => {
        result = item.PaperQuality == this.selectedPaper4 ? ((pagesNumber * bookQuantityNumber) / selectedSizeNumber / 500) * item.Rate : result;
      });
    } else {
        result = 0;
    }

    return result;
  }

  public generateItemQuotationAndEmit(itemTotal: number) {
    this.itemQuotation.name = this.name.value ? this.name.value: "";
    this.itemQuotation.quantity = this.bookQuantity.value ? Number(this.bookQuantity.value) : 0;
    this.itemQuotation.size = this.selectedSize;
    this.itemQuotation.dptr = this.selectedDPTR;
    this.itemQuotation.printedPages = this.pritedPages.value ? Number(this.pritedPages.value) : 0;
    this.itemQuotation.pages = this.pages.value ? Number(this.pages.value) : 0;
    this.itemQuotation.column = this.fbcol.value ? Number(this.fbcol.value) : 0;
    this.itemQuotation.side = this.side.value ? Number(this.side.value) : 0;
    this.itemQuotation.plate = this.selectedPlate;
    this.itemQuotation.bind = this.selectedBin;
    this.itemQuotation.numCounter = this.numCounter.value ? Number(this.numCounter.value) : 0;
    this.itemQuotation.paper1 = this.selectedPaper1;
    this.itemQuotation.paper2 = this.selectedPaper2;
    this.itemQuotation.paper3 = this.selectedPaper3;
    this.itemQuotation.paper4 = this.selectedPaper4;
    this.itemQuotation.total = this.calculateTotalAmt(itemTotal);
    this.itemQuotation.perBook = this.itemQuotation.total/this.itemQuotation.quantity;
    this.itemCalculationEvent.emit(this.itemQuotation)
  }

  public calculateTotalAmt(itemTotal: number): number {
    return Math.ceil(
      itemTotal < 1000
        ? itemTotal + (itemTotal * 50) / 100
        : itemTotal > 2000
          ? itemTotal + (itemTotal * 30) / 100
          : itemTotal + (itemTotal * 40) / 100
    );
  }

  public getPanelName(): string {
    return this.name.value && this.name.value !== "" ? this.name.value : "Add Details";
  }

  public getBookQty(): number {
    return this.bookQuantity.value ? Number(this.bookQuantity.value) : 0;
  }

}
