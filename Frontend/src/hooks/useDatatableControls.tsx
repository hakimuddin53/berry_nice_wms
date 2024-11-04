import { useCallback, useRef, useState } from "react";

export type order = "asc" | "desc";
export interface TablePropList<T> {
  rowClickHandler: (key?: number) => void;
  addClickHandler: () => void;
  page: number;
  pageSize: number;
  setPage: (page: number, pageSize: number | undefined) => void;
  orderBy: string;
  order: order;
  setOrder: (order: order, orderBy: string) => void;
  data: T[];
  pageData: T[];
  selections: number[];
  invalidRows: number[];
  loading: boolean;
  totalCount: number;
  setSearchValue: (searchValue: string) => void;
}
export interface UpdateControlsSettings<T> {
  data?: T[];
  page?: number;
  pageSize?: number;
  selections?: number[];
  invalidRows?: number[];
  orderBy?: string;
  order?: order;
  searchValue?: string;
  loading?: boolean;
}

export const useDatatableControls = <T,>(props: {
  initialData?: T[];
  selectionMode?: "single" | "multiple" | "none";
  addClickHandler?: () => void;
  loadData?: (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: order
  ) => Promise<T[]>;
  loadDataCount?: (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: order
  ) => Promise<number>;
}): {
  updateDatatableControls: (settings: UpdateControlsSettings<T>) => void;
  tableProps: TablePropList<T>;
  reloadData: (jumpToFirstPage?: boolean) => void;
  reloadDataCount: () => void;
} => {
  props.selectionMode = props.selectionMode || "none";

  const data = useRef<T[]>(props.initialData ?? []);
  const selections = useRef<number[]>([]);
  const invalidRows = useRef<number[]>([]);
  const page = useRef<number>(0);
  const pageSize = useRef<number>(10);
  const orderBy = useRef("");
  const order = useRef<order>("asc");
  const searchValue = useRef("");

  /* eslint-disable react-hooks/exhaustive-deps */
  const setPage = useCallback((page: number, pageSize: number | undefined) => {
    if (pageSize) {
      updateDatatableControls({ page, pageSize });
    } else {
      updateDatatableControls({ page });
    }
  }, []);

  const setOrder = useCallback((order: order, orderBy: string) => {
    updateDatatableControls({ order, orderBy });
  }, []);

  const setSelections = useCallback((selections: number[]) => {
    updateDatatableControls({ selections });
  }, []);

  const setSearchValue = useCallback((searchValue: string) => {
    updateDatatableControls({ searchValue });
  }, []);

  const reloadData = useCallback((jumpToFirstPage?: boolean) => {
    var settings = {} as UpdateControlsSettings<T>;
    if (jumpToFirstPage === undefined || jumpToFirstPage === true) {
      settings.page = 0;
      page.current = 0;
    }
    setTableProps(settings, true, true);
    if (props.loadData) {
      props
        .loadData(
          page.current,
          pageSize.current,
          searchValue.current,
          orderBy.current,
          order.current
        )
        .then((result) => {
          setTableProps(settings, true, false, result);
        });
    }
    if (props.loadDataCount) {
      props
        .loadDataCount(
          page.current,
          pageSize.current,
          searchValue.current,
          orderBy.current,
          order.current
        )
        .then((result) => {
          setTableProps(settings, true, undefined, undefined, result);
        });
    }
  }, []);

  const reloadDataCount = useCallback(() => {
    var settings = {} as UpdateControlsSettings<T>;

    if (props.loadDataCount) {
      props
        .loadDataCount(
          page.current,
          pageSize.current,
          searchValue.current,
          orderBy.current,
          order.current
        )
        .then((result) => {
          setTableProps(settings, true, undefined, undefined, result);
        });
    }
  }, []);
  /* eslint-enable */

  const rowClickHandler = (key?: number) => {
    if (key === undefined) {
      setSelections([]);
      return;
    }
    switch (props.selectionMode) {
      case "single":
        if (selections.current.includes(key)) {
          setSelections([]);
        } else {
          setSelections([key]);
        }
        break;
      case "multiple":
        if (selections.current.includes(key)) {
          setSelections(selections.current.filter((x) => x !== key));
        } else {
          setSelections([...selections.current, key]);
        }
        break;
      default:
        break;
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const updateDatatableControls = useCallback(
    (settings: UpdateControlsSettings<T>) => {
      data.current = settings.data ?? data.current;
      page.current = settings.page === undefined ? page.current : settings.page;
      pageSize.current = settings.pageSize ?? pageSize.current;
      selections.current = settings.selections ?? selections.current;
      invalidRows.current = settings.invalidRows ?? invalidRows.current;
      orderBy.current = settings.orderBy ?? orderBy.current;
      order.current = settings.order ?? order.current;
      searchValue.current =
        settings.searchValue === undefined
          ? searchValue.current
          : settings.searchValue;
      var async = false;
      var loading = settings.loading ?? false;
      if (props.loadData) {
        async = true;
        if (
          settings.page !== undefined ||
          settings.pageSize ||
          settings.order ||
          settings.orderBy ||
          settings.searchValue !== undefined
        ) {
          if (settings.page === undefined) {
            settings.page = 0;
            page.current = 0;
          }
          loading = true;
          props
            .loadData(
              page.current,
              pageSize.current,
              searchValue.current,
              orderBy.current,
              order.current
            )
            .then((result) => {
              setTableProps(settings, async, false, result);
            });
          if (props.loadDataCount) {
            props
              .loadDataCount(
                page.current,
                pageSize.current,
                searchValue.current,
                orderBy.current,
                order.current
              )
              .then((result) => {
                setTableProps(settings, async, undefined, undefined, result);
              });
          }
        }
      }
      setTableProps(settings, async, loading);
    },
    []
  );
  /* eslint-enable */

  const setTableProps = (
    settings: UpdateControlsSettings<T>,
    async: boolean,
    loading?: boolean,
    pageData?: T[],
    count?: number
  ) =>
    _setTableProps((currentValue) => {
      return {
        ...currentValue,
        ...settings,
        loading: loading !== undefined ? loading : currentValue.loading,
        pageData: async
          ? loading
            ? []
            : pageData
            ? pageData
            : currentValue.pageData
          : data.current.slice(
              page.current * pageSize.current,
              (page.current + 1) * pageSize.current
            ),
        totalCount: count ?? currentValue.totalCount,
      };
    });

  const [tableProps, _setTableProps] = useState<TablePropList<T>>({
    rowClickHandler,
    addClickHandler: props.addClickHandler || (() => {}),
    page: 0,
    pageSize: 10,
    setPage,
    orderBy: "",
    order: "asc",
    setOrder,
    data: props.initialData ?? [],
    selections: [],
    invalidRows: [],
    pageData: (props.initialData ?? []).slice(0, 10),
    loading: false,
    totalCount: 0,
    setSearchValue,
  });

  return {
    updateDatatableControls,
    tableProps,
    reloadData,
    reloadDataCount,
  };
};

export const TestComponent: React.FC<any> = (props) => {
  const datatableControls = useDatatableControls({
    initialData: props.transport.transportStops,
    addClickHandler: () => {},
  });
  return <DummyDatatable contorls={datatableControls}></DummyDatatable>;
};

export const DummyDatatable: React.FC<any> = (props) => {
  return <div></div>;
};
