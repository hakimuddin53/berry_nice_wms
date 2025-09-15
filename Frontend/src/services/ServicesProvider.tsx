import { CartonSizeServiceProvider } from "./CartonSizeService";
import { InventoryServiceProvider } from "./InventoryService";
import { LookupServiceProvider } from "./LookupService";
import { ProductServiceProvider } from "./ProductService";
import { UserRoleServiceProvider } from "./UserRoleService";
import { UserServiceProvider } from "./UserService";

const serviceProviders = [
  LookupServiceProvider,
  ProductServiceProvider,
  CartonSizeServiceProvider,
  InventoryServiceProvider,
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
