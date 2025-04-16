import { CartonSizeServiceProvider } from "./CartonSizeService";
import { CategoryServiceProvider } from "./CategoryService";
import { ColourServiceProvider } from "./ColourService";
import { DesignServiceProvider } from "./DesignService";
import { InventoryServiceProvider } from "./InventoryService";
import { LocationServiceProvider } from "./LocationService";
import { ProductServiceProvider } from "./ProductService";
import { SizeServiceProvider } from "./SizeService";
import { StockInServiceProvider } from "./StockInService";
import { StockOutServiceProvider } from "./StockOutService";
import { StockReservationServiceProvider } from "./StockReservationService";
import { StockTransferServiceProvider } from "./StockTransferService";
import { UserRoleServiceProvider } from "./UserRoleService";
import { UserServiceProvider } from "./UserService";
import { WarehouseServiceProvider } from "./WarehouseService";

const serviceProviders = [
  StockInServiceProvider,
  StockOutServiceProvider,
  WarehouseServiceProvider,
  ProductServiceProvider,
  CategoryServiceProvider,
  ColourServiceProvider,
  DesignServiceProvider,
  LocationServiceProvider,
  SizeServiceProvider,
  CartonSizeServiceProvider,
  StockReservationServiceProvider,
  InventoryServiceProvider,
  StockTransferServiceProvider,
  UserServiceProvider,
  UserRoleServiceProvider,
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
