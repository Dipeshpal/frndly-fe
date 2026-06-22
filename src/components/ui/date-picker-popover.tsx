import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface DatePickerPopoverProps {
  value: string | null;
  max?: string;
  onChange: (date: string) => void;
  onClose: () => void;
  visible: boolean;
}

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: Date[] = [];
  // pad start
  for (let i = 0; i < first.getDay(); i++) {
    days.push(new Date(year, month, 1 - (first.getDay() - i)));
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  // pad end to fill last row
  const remainder = days.length % 7;
  if (remainder !== 0) {
    for (let i = 1; i <= 7 - remainder; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }
  return days;
}

export function DatePickerPopover({ value, max, onChange, onClose, visible }: DatePickerPopoverProps) {
  const { colors } = useTheme();
  const todayStr = toDateString(new Date());
  const today = new Date();

  const initial = value ? new Date(value + 'T00:00:00') : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useEffect(() => {
    if (visible) {
      const d = value ? new Date(value + 'T00:00:00') : today;
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [visible, value]);

  const days = getDaysInMonth(viewYear, viewMonth);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    const nextDate = new Date(viewYear, viewMonth + 1, 1);
    if (toDateString(nextDate) > (max ?? todayStr)) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isNextMonthDisabled = (() => {
    const nextDate = new Date(viewYear, viewMonth + 1, 1);
    return toDateString(nextDate) > (max ?? todayStr);
  })();

  const selectDay = (d: Date) => {
    const ds = toDateString(d);
    if (ds > (max ?? todayStr)) return;
    onChange(ds);
    onClose();
  };

  const jumpToday = () => {
    onChange(todayStr);
    onClose();
  };

  const card = (
    <View
      style={{
        width: 308,
        backgroundColor: colors.surfaceCard,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        ...(Platform.OS === 'web' ? { boxShadow: '0 8px 32px rgba(0,0,0,0.32)' } as any : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.32,
          shadowRadius: 16,
          elevation: 16,
        }),
      }}
    >
      {/* Month nav header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <Pressable
          onPress={prevMonth}
          style={({ pressed }: any) => ({
            width: 32, height: 32,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? colors.surfaceStrong : 'transparent',
          })}
        >
          <Text style={{ color: colors.ink, fontSize: 18, fontWeight: '500' }}>‹</Text>
        </Pressable>

        <Text style={{ ...Typography.titleSm, color: colors.ink }}>{monthLabel}</Text>

        <Pressable
          onPress={nextMonth}
          disabled={isNextMonthDisabled}
          style={({ pressed }: any) => ({
            width: 32, height: 32,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? colors.surfaceStrong : 'transparent',
            opacity: isNextMonthDisabled ? 0.3 : 1,
          })}
        >
          <Text style={{ color: colors.ink, fontSize: 18, fontWeight: '500' }}>›</Text>
        </Pressable>
      </View>

      {/* Weekday labels */}
      <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm }}>
        {WEEKDAYS.map(w => (
          <View key={w} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
            <Text style={{ ...Typography.caption, color: colors.muted }}>{w}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View style={{ paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm }}>
        {Array.from({ length: days.length / 7 }).map((_, rowIdx) => (
          <View key={rowIdx} style={{ flexDirection: 'row' }}>
            {days.slice(rowIdx * 7, rowIdx * 7 + 7).map((d, colIdx) => {
              const ds = toDateString(d);
              const isCurrentMonth = d.getMonth() === viewMonth;
              const isSelected = ds === value;
              const isToday = ds === todayStr;
              const isFuture = ds > (max ?? todayStr);
              const isDisabled = isFuture || !isCurrentMonth;

              return (
                <Pressable
                  key={`${rowIdx}-${colIdx}`}
                  onPress={() => !isDisabled && selectDay(d)}
                  style={({ pressed, hovered }: any) => ({
                    flex: 1,
                    margin: 2,
                    height: 36,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected
                      ? colors.brandBlue
                      : isToday && !isSelected
                      ? `${colors.brandBlue}22`
                      : pressed || hovered
                      ? colors.surfaceStrong
                      : 'transparent',
                    borderWidth: isToday && !isSelected ? 1 : 0,
                    borderColor: isToday && !isSelected ? `${colors.brandBlue}66` : 'transparent',
                    opacity: !isCurrentMonth ? 0.25 : isFuture ? 0.35 : 1,
                  })}
                >
                  <Text style={{
                    ...Typography.bodySm,
                    fontWeight: isSelected || isToday ? '600' : '400',
                    color: isSelected ? '#fff' : isToday ? colors.brandBlue : colors.ink,
                  }}>
                    {d.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: Spacing.sm,
      }}>
        <Pressable
          onPress={onClose}
          style={({ pressed, hovered }: any) => ({
            paddingHorizontal: Spacing.md,
            paddingVertical: 7,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: pressed || hovered ? colors.surfaceStrong : 'transparent',
          })}
        >
          <Text style={{ ...Typography.button, color: colors.muted }}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={jumpToday}
          style={({ pressed, hovered }: any) => ({
            paddingHorizontal: Spacing.md,
            paddingVertical: 7,
            borderRadius: 8,
            backgroundColor: pressed || hovered ? `${colors.brandBlue}dd` : colors.brandBlue,
          })}
        >
          <Text style={{ ...Typography.button, color: '#fff' }}>Jump to Today</Text>
        </Pressable>
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          {card}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
