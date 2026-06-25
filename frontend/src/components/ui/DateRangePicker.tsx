import { Calendar } from 'lucide-react';
import { Input } from './Input';
import dayjs from 'dayjs';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }: DateRangePickerProps) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-dark-400" />
      <Input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="w-40"
      />
    </div>
    <span className="text-dark-400">-</span>
    <Input
      type="date"
      value={endDate}
      onChange={(e) => onEndDateChange(e.target.value)}
      className="w-40"
    />
  </div>
);

export const getDefaultDateRange = () => ({
  startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
});
