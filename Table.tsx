import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { TableColumn, TableProps } from './table.types';

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No records found.',
  rowKey,
  className = '',
}: TableProps<T>) {
  return (
    <View className={`overflow-hidden rounded-[10px] border border-gray-200 bg-white ${className}`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="min-w-full">
          <View className="flex-row border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <View
                key={column.key}
                style={{ width: column.width, flex: column.width ? undefined : column.flex ?? 1 }}
                className="justify-center px-3 py-3"
              >
                <Text className="text-[13px] font-semibold text-gray-700">{column.title}</Text>
              </View>
            ))}
          </View>

          {loading ? (
            <View className="items-center justify-center px-4 py-8">
              <ActivityIndicator />
              <Text className="mt-2 text-[13px] text-gray-500">Loading...</Text>
            </View>
          ) : data.length === 0 ? (
            <View className="items-center justify-center px-4 py-8">
              <Text className="text-[14px] text-gray-500">{emptyMessage}</Text>
            </View>
          ) : (
            data.map((row, rowIndex) => (
              <View
                key={rowKey ? rowKey(row, rowIndex) : String(rowIndex)}
                className="flex-row border-b border-gray-100"
              >
                {columns.map((column) => (
                  <View
                    key={`${column.key}-${rowIndex}`}
                    style={{ width: column.width, flex: column.width ? undefined : column.flex ?? 1 }}
                    className="justify-center px-3 py-3"
                  >
                    {column.render ? (
                      column.render(row, rowIndex)
                    ) : (
                      <Text className="text-[13px] text-gray-800">
                        {row[column.key] == null || row[column.key] === '' ? '—' : String(row[column.key])}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default Table;
export { Table };
