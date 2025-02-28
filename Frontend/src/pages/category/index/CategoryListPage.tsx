import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  CategoryDetailsDto,
  CategorySearchDto,
} from "interfaces/v12/category/category";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCategoryService } from "services/CategoryService";
import { useCategoryTable } from "./datatables/useCategoryTable";

function CategoryListPage() {
  const { t } = useTranslation();

  const [categoryTable] = useCategoryTable();
  const CategoryService = useCategoryService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: CategorySearchDto = {
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
    return CategoryService.searchCategorys(searchOptions)
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
    return CategoryService.countCategorys(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as CategoryDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("category")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("category") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-category"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("category")}
        tableKey="CategoryListPage-Inbound Deliveries"
        headerCells={categoryTable}
        data={tableProps}
        dataKey="categoryId"
        showSearch={true}
      />
    </Page>
  );
}

export default CategoryListPage;
