import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body?: string[][];
      theme?: string;
      styles?: Record<string, unknown>;
      headStyles?: Record<string, unknown>;
      [key: string]: unknown;
    }) => void;
  }
}
