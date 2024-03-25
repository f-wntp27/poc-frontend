export type ImporttationDrugResquestModel = {
  drugName: string;
  drugIngredients: string;
  drugPrice: number;
  drugUnit: string;
};

export type ImporttationDrugResponseModel = {
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
} & ImporttationDrugResponseModel;
