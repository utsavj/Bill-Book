import { GetValuesService } from "./get-values.service";
import { TestBed } from "@angular/core/testing";

describe("GetValuesService", () => {

  let service: GetValuesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GetValuesService
      ]
    });
    service = TestBed.get(GetValuesService);

  });

  it("should be able to create service instance", () => {
    expect(service).toBeDefined();
  });

});
