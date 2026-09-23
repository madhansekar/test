import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';

import PaymentHistory from './PaymentHistory';

type BillingPaymentHistoryProps = {
  api: any;
  policyNumber: string;
};

export default function BillingPaymentHistory({
  api,
  policyNumber,
}: BillingPaymentHistoryProps) {
  const [paymentHistoryVisible, setPaymentHistoryVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View payment history"
        onPress={() => setPaymentHistoryVisible(true)}
        className="rounded-full border border-gray-300 px-4 py-3"
      >
        <Text className="text-center text-[14px] font-semibold text-gray-800">
          Payment History
        </Text>
      </Pressable>

      <PaymentHistory
        visible={paymentHistoryVisible}
        onClose={() => setPaymentHistoryVisible(false)}
        api={api}
        policyNumber={policyNumber}
      />
    </>
  );
}
