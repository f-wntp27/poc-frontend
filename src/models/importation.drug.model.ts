export type DrugModel = {
  drugName: string;
  drugIngredients: string;
  drugPrice: number | null;
  drugUnit: string;
};

export type MedicalTool = {
  toolName: string;
  toolBrand: string;
  toolAmount: number | null;
  toolAmountUnit: string;
  toolPrice: number | null;
};

export type ImportationLicenseResquestModel = {
  email: string;
  processDefKey: string;
  // drugResquest: DrugModel;
  // medicalToolRequest: MedicalTool;
  document: File[];
};

export type ImportationDrugResponseModel = {
  drugName?: string;
  drugIngredients?: string;
  drugPrice: number;
  drugUnit?: string;
  reqId: string;
  taskExpiredDate: Date | string;
  taskId: string;
};

export type FileModel = {
  id: string;
  fileName: string;
  fileSize: number;
};

export type ImporttationDrugExciseResponseModel = {
  files: FileModel[];
  fdaComment: string;
} & ImportationDrugResponseModel;
