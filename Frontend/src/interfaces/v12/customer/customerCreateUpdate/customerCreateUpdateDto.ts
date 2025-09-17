export interface CustomerCreateUpdateDto {
  customerCode: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  customerType: string; // Retail / Dealer / Agent
}