import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import { ProductSearchDto } from "interfaces/v12/product/productSearch/productSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useProductService } from "services/ProductService";
import { useProductTable } from "./datatables/useProductTable";

function ProductListPage() {
  const { t } = useTranslation();

  const [productTable] = useProductTable();
  const ProductService = useProductService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: ProductSearchDto = {
      search: searchValue,
      page: page + 1,
      pageSize,
    };

    return searchOptions;
  };

  const loadData = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(
      page,
      pageSize,
      searchValue,
      orderBy,
      order
    );
    return ProductService.searchProducts(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return [];
      });
  };

  const loadDataCount = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(
      page,
      pageSize,
      searchValue,
      orderBy,
      order
    );
    return ProductService.countProducts(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as ProductDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("product")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("product") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-product"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("product")}
        tableKey="ProductListPage"
        headerCells={productTable}
        data={tableProps}
        dataKey="id"
        showSearch={true}
      />
    </Page>
  );
}

export default ProductListPage;
