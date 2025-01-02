import { EventSettingServiceProvider } from "./EventSettingService";
import { ProductServiceProvider } from "./ProductService";
import { StockInServiceProvider } from "./StockInService";
import { WarehouseServiceProvider } from "./WarehouseService";

const serviceProviders = [
  EventSettingServiceProvider,
  StockInServiceProvider,
  WarehouseServiceProvider,
  ProductServiceProvider,
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
