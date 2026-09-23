import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import AppModal from './AppModal';
import Table from './Table';
import type { TableColumn } from './table.types';

export type Payment = {
  id?: string | number;
  datePaid?: string;
  amountPaid?: string | number;
  paymentType?: string;
  last4CheckorCardNum?: string;
  status?: string;
  [key: string]: unknown;
};

type PaymentHistoryApi = {
  withAuth: () => {
    getPayments: (policyNumber: string) => Promise<{
      data?: { payments?: Payment[] } | Payment[];
    }>;
  };
};

type PaymentHistoryProps = {
  visible: boolean;
  onClose: () => void;
  api: PaymentHistoryApi;
  policyNumber: string;
};

const formatPaymentMethod = (payment: Payment) => {
  const type = String(payment.paymentType ?? '').trim();
  const last4 = String(payment.last4CheckorCardNum ?? '').replace(/\D/g, '');

  if (type.toLowerCase().includes('transfer')) return 'Bank Transfer';
  if (last4 && type) return `${type} ****${last4}`;
  return type || '—';
};

const formatStatus = (status?: string) => {
  const value = String(status ?? '').trim().toLowerCase();
  if (value === 'active') return 'Paid';
  if (value === 'submitted') return 'Pending';
  if (value === 'reversed') return 'Reversed';
  return status?.trim() || '—';
};

const statusClass = (status: string) => {
  if (status === 'Paid') return 'rounded-full bg-green-50 px-2 py-1 text-green-700';
  if (status === 'Failed' || status === 'Declined') {
    return 'rounded-full bg-red-50 px-2 py-1 text-red-700';
  }
  return 'rounded-full bg-gray-100 px-2 py-1 text-gray-700';
};

const sortByDate = (payments: Payment[]) =>
  [...payments].sort(
    (a, b) =>
      new Date(String(b.datePaid ?? '')).getTime() -
      new Date(String(a.datePaid ?? '')).getTime(),
  );

export default function PaymentHistory({
  visible,
  onClose,
  api,
  policyNumber,
}: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadPayments = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.withAuth().getPayments(policyNumber);
      const payload = response?.data;
      const records = Array.isArray(payload) ? payload : payload?.payments ?? [];
      setPayments(sortByDate(records));
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.error ??
          'Unable to fetch your payments. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && policyNumber) loadPayments();
  }, [visible, policyNumber]);

  const columns = useMemo<TableColumn<Payment>[]>(
    () => [
      {
        key: 'datePaid',
        title: 'Date',
        flex: 1,
        render: (row) => <Text className="text-[13px] text-gray-800">{row.datePaid || '—'}</Text>,
      },
      {
        key: 'amountPaid',
        title: 'Amount',
        flex: 1,
        render: (row) => <Text className="text-[13px] text-gray-800">{String(row.amountPaid ?? '—')}</Text>,
      },
      {
        key: 'paymentType',
        title: 'Payment Method',
        flex: 1.5,
        render: (row) => <Text className="text-[13px] text-gray-800">{formatPaymentMethod(row)}</Text>,
      },
      {
        key: 'status',
        title: 'Status',
        flex: 1,
        render: (row) => {
          const label = formatStatus(row.status);
          return (
            <View className={statusClass(label)}>
              <Text className="text-[12px] font-medium">{label}</Text>
            </View>
          );
        },
      },
    ],
    [],
  );

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Payment History"
      secondaryButton={{ label: 'Close', onPress: onClose }}
    >
      <View className="gap-[16px]">
        {errorMessage ? (
          <Text className="px-1 text-[14px] text-red-600">{errorMessage}</Text>
        ) : null}

        <Table
          columns={columns}
          data={payments}
          loading={loading}
          emptyMessage="No payment history found."
          rowKey={(row, index) => String(row.id ?? `${row.datePaid}-${index}`)}
        />

        <Text className="text-[14px] text-gray-600">
          Need help with a payment? Contact our customer service team.
        </Text>
      </View>
    </AppModal>
  );
}
