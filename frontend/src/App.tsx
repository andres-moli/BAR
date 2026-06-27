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
import CashRegisterHistoryPage from '@/pages/cash-register/CashRegisterHistoryPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import ProductMovementsPage from '@/pages/inventory/ProductMovementsPage';
import SubOrdersPage from '@/pages/orders/SubOrdersPage';
import CombosPage from '@/pages/combos/CombosPage';

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
              <Route path="invoices" element={
                <ProtectedRoute roles={['admin']}><CollectionAccountsPage /></ProtectedRoute>
              } />
              <Route path="invoices/:id" element={
                <ProtectedRoute roles={['admin']}><CollectionAccountDetailPage /></ProtectedRoute>
              } />
              <Route path="clients" element={
                <ProtectedRoute roles={['admin']}><ClientsPage /></ProtectedRoute>
              } />
              <Route path="clients/:id" element={
                <ProtectedRoute roles={['admin']}><ClientDetailPage /></ProtectedRoute>
              } />
              <Route
                path="users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route path="reports" element={
                <ProtectedRoute roles={['admin']}><ReportsPage /></ProtectedRoute>
              } />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="categories" element={
                <ProtectedRoute roles={['admin']}><CategoriesPage /></ProtectedRoute>
              } />
              <Route path="accounts" element={
                <ProtectedRoute roles={['admin']}><AccountsPage /></ProtectedRoute>
              } />
              <Route path="payment-methods" element={
                <ProtectedRoute roles={['admin']}><PaymentMethodsPage /></ProtectedRoute>
              } />
              <Route path="cash-register" element={
                <ProtectedRoute roles={['admin']}><CashRegisterPage /></ProtectedRoute>
              } />
              <Route path="cash-register/history" element={
                <ProtectedRoute roles={['admin']}><CashRegisterHistoryPage /></ProtectedRoute>
              } />
              <Route path="inventory" element={
                <ProtectedRoute roles={['admin']}><InventoryPage /></ProtectedRoute>
              } />
              <Route path="inventory/:productId" element={
                <ProtectedRoute roles={['admin']}><ProductMovementsPage /></ProtectedRoute>
              } />
              <Route path="sub-orders" element={
                <ProtectedRoute roles={['admin']}><SubOrdersPage /></ProtectedRoute>
              } />
              <Route path="combos" element={<CombosPage />} />
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
