import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import {
  InventoryAuditDto,
  InventoryAuditSearchDto,
} from "interfaces/v12/inventory/inventoryAuditDto";
import {
  InventorySummaryRowDto,
  InventorySummarySearchDto,
} from "interfaces/v12/inventory/inventorySummaryDto";
import {
  InvoicedProductReportRowDto,
  InvoicedProductReportSearchDto,
} from "interfaces/v12/inventory/invoicedProductReportDto";
import { UpdateInventoryBalanceDto } from "interfaces/v12/inventory/updateInventoryBalanceDto";
import { UpdateProductPricingDto } from "interfaces/v12/inventory/updateProductPricingDto";
import { ProductAuditLogDto } from "interfaces/v12/product/productAuditLogDto";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IInventoryService {
  searchAudit: (
    dto: InventoryAuditSearchDto
  ) => Promise<PagedListDto<InventoryAuditDto>>;
  searchInvoicedReport: (
    dto: InvoicedProductReportSearchDto
  ) => Promise<PagedListDto<InvoicedProductReportRowDto>>;
  searchSummary: (
    dto: InventorySummarySearchDto
  ) => Promise<PagedListDto<InventorySummaryRowDto>>;
  getProductAuditLog: (productId: string) => Promise<ProductAuditLogDto[]>;
  updatePricing: (
    productId: string,
    dto: UpdateProductPricingDto
  ) => Promise<void>;
  updateBalance: (
    productId: string,
    dto: UpdateInventoryBalanceDto
  ) => Promise<void>;
}

const InventoryServiceContext = createContext({} as IInventoryService);

export type InventoryServiceProviderProps = {
  children?: React.ReactNode;
  searchAudit?: (
    dto: InventoryAuditSearchDto
  ) => Promise<PagedListDto<InventoryAuditDto>>;
  searchInvoicedReport?: (
    dto: InvoicedProductReportSearchDto
  ) => Promise<PagedListDto<InvoicedProductReportRowDto>>;
  searchSummary?: (
    dto: InventorySummarySearchDto
  ) => Promise<PagedListDto<InventorySummaryRowDto>>;
  getProductAuditLog?: (productId: string) => Promise<ProductAuditLogDto[]>;
  updatePricing?: (
    productId: string,
    dto: UpdateProductPricingDto
  ) => Promise<void>;
  updateBalance?: (
    productId: string,
    dto: UpdateInventoryBalanceDto
  ) => Promise<void>;
};

export const InventoryServiceProvider: React.FC<
  InventoryServiceProviderProps
> = (props) => {
  const searchAudit = (dto: InventoryAuditSearchDto) => {
    return axios.post("/inventory/audit", dto).then((res) => res.data);
  };

  const searchInvoicedReport = (dto: InvoicedProductReportSearchDto) => {
    return axios
      .post("/inventory/invoiced-report", dto)
      .then((res) => res.data);
  };

  const searchSummary = (dto: InventorySummarySearchDto) => {
    return axios.post("/inventory/summary", dto).then((res) => res.data);
  };

  const getProductAuditLog = (productId: string) => {
    return axios
      .get<ProductAuditLogDto[]>(`/inventory/product/${productId}/audit-log`)
      .then((res) => res.data);
  };

  const updatePricing = (productId: string, dto: UpdateProductPricingDto) => {
    return axios
      .put(`/inventory/summary/${productId}/pricing`, dto)
      .then(() => undefined);
  };

  const updateBalance = (productId: string, dto: UpdateInventoryBalanceDto) => {
    return axios
      .put(`/inventory/balance/${productId}`, dto)
      .then(() => undefined);
  };

  const value: IInventoryService = {
    searchAudit: props.searchAudit || searchAudit,
    searchInvoicedReport: props.searchInvoicedReport || searchInvoicedReport,
    searchSummary: props.searchSummary || searchSummary,
    getProductAuditLog: props.getProductAuditLog || getProductAuditLog,
    updatePricing: props.updatePricing || updatePricing,
    updateBalance: props.updateBalance || updateBalance,
  };

  return (
    <InventoryServiceContext.Provider value={value}>
      {props.children}
    </InventoryServiceContext.Provider>
  );
};

export const useInventoryService = () => useContext(InventoryServiceContext);
