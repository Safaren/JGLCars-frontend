export interface FieldConfig {
  label: string;
  visible: boolean;
  editable: boolean;
  type: FieldType;
  options?: Array<string | OptionItem>;
  required?: boolean;
  order?: number; // ⬅️ opcional para que no te rompa nada
}
