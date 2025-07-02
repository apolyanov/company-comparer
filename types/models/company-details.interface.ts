import { CompanySize } from "../enums";
import { CompanyType } from "../enums/company-type.enum";

export interface CompanyDetails {
  company_type: CompanyType;
  size: CompanySize;
  ceo_name: string;
  headquarters: string;
}
