import { CustomerServiceProvider } from "./CustomerService";
import { ExpenseServiceProvider } from "./ExpenseService";
import { InventoryServiceProvider } from "./InventoryService";
import { InvoiceServiceProvider } from "./InvoiceService";
import { LogbookServiceProvider } from "./LogbookService";
import { LookupServiceProvider } from "./LookupService";
import { ProductServiceProvider } from "./ProductService";
import { StockRecieveServiceProvider } from "./StockRecieveService";
import { StockTakeServiceProvider } from "./StockTakeService";
import { StockTransferServiceProvider } from "./StockTransferService";
import { SupplierServiceProvider } from "./SupplierService";
import { UserRoleServiceProvider } from "./UserRoleService";
import { UserServiceProvider } from "./UserService";

const serviceProviders = [
  LookupServiceProvider,
  InventoryServiceProvider,
  ProductServiceProvider,
  UserServiceProvider,
  UserRoleServiceProvider,
  CustomerServiceProvider,
  SupplierServiceProvider,
  ExpenseServiceProvider,
  InvoiceServiceProvider,
  StockRecieveServiceProvider,
  StockTakeServiceProvider,
  StockTransferServiceProvider,
  LogbookServiceProvider,
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
