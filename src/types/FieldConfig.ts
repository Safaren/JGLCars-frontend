// src/types/FieldConfig.ts

export type FieldType = "text" | "number" | "select" | "date" | "boolean";

export interface OptionItem {
  label: string;
  value: string;
}

export interface FieldConfig {
  label: string;
  visible: boolean;
  editable: boolean;
  type: FieldType;
  options?: Array<string | OptionItem>;
  required?: boolean;
  order?: number;
}
