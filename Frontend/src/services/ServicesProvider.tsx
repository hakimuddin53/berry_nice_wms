import { CartonSizeServiceProvider } from "./CartonSizeService";
import { CustomerServiceProvider } from "./CustomerService";
import { ExpenseServiceProvider } from "./ExpenseService";
import { InventoryServiceProvider } from "./InventoryService";
import { LookupServiceProvider } from "./LookupService";
import { ProductServiceProvider } from "./ProductService";
import { StockInServiceProvider } from "./StockInService";
import { InvoiceServiceProvider } from "./InvoiceService";
import { SupplierServiceProvider } from "./SupplierService";
import { UserRoleServiceProvider } from "./UserRoleService";
import { UserServiceProvider } from "./UserService";

const serviceProviders = [
  LookupServiceProvider,
  ProductServiceProvider,
  CartonSizeServiceProvider,
  InventoryServiceProvider,
  UserServiceProvider,
  UserRoleServiceProvider,
  CustomerServiceProvider,
  SupplierServiceProvider,
  ExpenseServiceProvider,
  InvoiceServiceProvider,
  StockInServiceProvider,
];
export type ServicesProviderProps = {
  children?: React.ReactNode;
};
export const ServicesProvider: React.FC<ServicesProviderProps> = (props) => {
  return (
    <>
      {serviceProviders.reduceRight((acc, Comp) => {
        return <Comp>{acc}</Comp>;
      }, props.children)}
    </>
  );
};
