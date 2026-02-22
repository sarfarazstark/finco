'use client';

import ReactDatePicker, {
	DatePickerProps as ReactDatePickerProps,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';
import React from 'react';

export type DatePickerProps = ReactDatePickerProps & {
	className?: string;
};

export function DatePicker({
	className,
	showTimeSelect = true,
	timeFormat = 'h:mm aa',
	timeIntervals = 15,
	timeCaption = 'Time',
	dateFormat = 'MMM d, yyyy h:mm aa',
	...props
}: DatePickerProps) {
	return (
		<div className="relative w-full">
			<ReactDatePicker
				showTimeSelect={showTimeSelect}
				timeFormat={timeFormat}
				timeIntervals={timeIntervals}
				timeCaption={timeCaption}
				dateFormat={dateFormat}
				wrapperClassName="w-full"
				className={cn(
					'w-full bg-grey-50 border border-grey-200 focus:border-grey-300 rounded-lg pl-3 pr-10 h-11 text-sm font-medium text-grey-900 focus:outline-none focus:bg-white transition-colors cursor-pointer',
					className
				)}
				{...props}
			/>
			<i className="ti ti-calendar-event absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 pointer-events-none text-lg" />
		</div>
	);
}
