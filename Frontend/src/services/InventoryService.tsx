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
import {
  PurchaseQualityReportRowDto,
  PurchaseQualityReportSearchDto,
} from "interfaces/v12/inventory/purchaseQualityReportDto";
import { UpdateInventoryBalanceDto } from "interfaces/v12/inventory/updateInventoryBalanceDto";
import { UpdateProductPricingDto } from "interfaces/v12/inventory/updateProductPricingDto";
import { UpdateRetailPriceDto } from "interfaces/v12/inventory/updateRetailPriceDto";
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
  getInvoicedReportTotal: (
    dto: InvoicedProductReportSearchDto
  ) => Promise<number>;
  searchSummary: (
    dto: InventorySummarySearchDto
  ) => Promise<PagedListDto<InventorySummaryRowDto>>;
  searchPurchaseQualityReport: (
    dto: PurchaseQualityReportSearchDto
  ) => Promise<PagedListDto<PurchaseQualityReportRowDto>>;
  getProductAuditLog: (productId: string) => Promise<ProductAuditLogDto[]>;
  updatePricing: (
    productId: string,
    dto: UpdateProductPricingDto
  ) => Promise<void>;
  updateRetailPrice: (
    productId: string,
    dto: UpdateRetailPriceDto
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
  getInvoicedReportTotal?: (
    dto: InvoicedProductReportSearchDto
  ) => Promise<number>;
  searchSummary?: (
    dto: InventorySummarySearchDto
  ) => Promise<PagedListDto<InventorySummaryRowDto>>;
  searchPurchaseQualityReport?: (
    dto: PurchaseQualityReportSearchDto
  ) => Promise<PagedListDto<PurchaseQualityReportRowDto>>;
  getProductAuditLog?: (productId: string) => Promise<ProductAuditLogDto[]>;
  updatePricing?: (
    productId: string,
    dto: UpdateProductPricingDto
  ) => Promise<void>;
  updateRetailPrice?: (
    productId: string,
    dto: UpdateRetailPriceDto
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

  const getInvoicedReportTotal = (dto: InvoicedProductReportSearchDto) => {
    return axios
      .post<number>("/inventory/invoiced-report-total", dto)
      .then((res) => res.data);
  };

  const searchSummary = (dto: InventorySummarySearchDto) => {
    return axios.post("/inventory/summary", dto).then((res) => res.data);
  };

  const searchPurchaseQualityReport = (dto: PurchaseQualityReportSearchDto) => {
    return axios
      .post("/inventory/purchase-quality-report", dto)
      .then((res) => res.data);
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

  const updateRetailPrice = (productId: string, dto: UpdateRetailPriceDto) => {
    return axios
      .put(`/inventory/pricing/${productId}/retail`, dto)
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
    getInvoicedReportTotal:
      props.getInvoicedReportTotal || getInvoicedReportTotal,
    searchSummary: props.searchSummary || searchSummary,
    searchPurchaseQualityReport:
      props.searchPurchaseQualityReport || searchPurchaseQualityReport,
    getProductAuditLog: props.getProductAuditLog || getProductAuditLog,
    updatePricing: props.updatePricing || updatePricing,
    updateRetailPrice: props.updateRetailPrice || updateRetailPrice,
    updateBalance: props.updateBalance || updateBalance,
  };

  return (
    <InventoryServiceContext.Provider value={value}>
      {props.children}
    </InventoryServiceContext.Provider>
  );
};

export const useInventoryService = () => useContext(InventoryServiceContext);
