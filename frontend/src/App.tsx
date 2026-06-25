import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import LoginPage from '@/pages/login/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import TablesPage from '@/pages/tables/TablesPage';
import TableDetailPage from '@/pages/tables/TableDetailPage';
import ProductsPage from '@/pages/products/ProductsPage';
import ProductFormPage from '@/pages/products/ProductFormPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import OrderDetailPage from '@/pages/orders/OrderDetailPage';
import BillingPage from '@/pages/billing/BillingPage';
import BillingDetailPage from '@/pages/billing/BillingDetailPage';
import CollectionAccountsPage from '@/pages/invoices/CollectionAccountsPage';
import CollectionAccountDetailPage from '@/pages/invoices/CollectionAccountDetailPage';
import ClientsPage from '@/pages/clients/ClientsPage';
import ClientDetailPage from '@/pages/clients/ClientDetailPage';
import UsersPage from '@/pages/users/UsersPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import CategoriesPage from '@/pages/categories/CategoriesPage';
import AccountsPage from '@/pages/accounts/AccountsPage';
import PaymentMethodsPage from '@/pages/payment-methods/PaymentMethodsPage';
import CashRegisterPage from '@/pages/cash-register/CashRegisterPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import ProductMovementsPage from '@/pages/inventory/ProductMovementsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="tables" element={<TablesPage />} />
              <Route path="tables/:id" element={<TableDetailPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/:id/edit" element={<ProductFormPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="billing/:orderId" element={<BillingDetailPage />} />
              <Route path="invoices" element={<CollectionAccountsPage />} />
              <Route path="invoices/:id" element={<CollectionAccountDetailPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="clients/:id" element={<ClientDetailPage />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute adminOnly>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="payment-methods" element={<PaymentMethodsPage />} />
              <Route path="cash-register" element={<CashRegisterPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="inventory/:productId" element={<ProductMovementsPage />} />
            </Route>
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
