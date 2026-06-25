import { useState, useCallback, useMemo } from 'react';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
}

interface PaginationActions {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  reset: () => void;
}

export function usePagination(
  initialPage: number = 1,
  initialPageSize: number = 10
): [PaginationState, PaginationActions] {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const from = useMemo(
    () => (total === 0 ? 0 : (currentPage - 1) * pageSize + 1),
    [currentPage, pageSize, total]
  );

  const to = useMemo(
    () => Math.min(currentPage * pageSize, total),
    [currentPage, pageSize, total]
  );

  const setPage = useCallback(
    (page: number) => {
      const p = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(p);
    },
    [totalPages]
  );

  const handleSetPageSize = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    []
  );

  const nextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const prevPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotal(0);
  }, [initialPage, initialPageSize]);

  const state: PaginationState = {
    currentPage,
    pageSize,
    total,
    totalPages,
    from,
    to,
  };

  const actions: PaginationActions = {
    setPage,
    setPageSize: handleSetPageSize,
    setTotal,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    reset,
  };

  return [state, actions];
}

export default usePagination;
