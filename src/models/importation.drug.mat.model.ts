import type { ImporttationDrugResponseModel } from './importation.drug.model';

export type ImporttationDrugMatResquestModel = {
  materialName: string;
  materialAmount: number;
  materialUnit: string;
};

export type ImporttationDrugMatResponseModel = {
  licenseNo: string;
  importationDrugsId: string;

  details: ImporttationDrugMatResquestModel[];
} & ImporttationDrugResponseModel;
