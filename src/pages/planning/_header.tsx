/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import NavigateNextSharpIcon from '@mui/icons-material/NavigateNextSharp';
import NavigateBeforeSharpIcon from '@mui/icons-material/NavigateBeforeSharp';
import ZoomInSharpIcon from '@mui/icons-material/ZoomInSharp';
import ZoomOutSharpIcon from '@mui/icons-material/ZoomOutSharp';
import { DateTime } from 'luxon';

export default function Header(props) {
  const { weeks, dayWidth, startDate, setStartDate, setDayWidth } = props;

  return (
    <>
      <div className="flex flex-row border-b-8 justify-end">
        <div className="inline-flex shadow-sm mr-4" role="group">
          <button
            onClick={() => setDayWidth(24)}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            <ZoomOutSharpIcon />
          </button>
          <button
            onClick={() => setDayWidth(48)}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            <ZoomInSharpIcon />
          </button>
        </div>
        <div className="inline-flex shadow-sm" role="group">
          <button
            onClick={() => setStartDate(startDate.minus({ weeks: 1 }))}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            <NavigateBeforeSharpIcon />
          </button>
          <button
            onClick={() => setStartDate(DateTime.now().startOf('week'))}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Nuværende uge
          </button>
          <button
            onClick={() => setStartDate(startDate.plus({ weeks: 1 }))}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            <NavigateNextSharpIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="w-1/5 border-r-4 border-b-4 p-2">Projekter</div>
        <div className="w-4/5 flex flex-row border-b-4">
          {weeks &&
            weeks.map((week, index) => (
              <div
                key={index}
                className="border-r-4"
                style={{ width: dayWidth * week.days.length + 'px' }}
              >
                <div className="flex justify-between">
                  <div className="bg-slate-300 text-slate-500 text-sm w-5 text-center rounded-br-sm">
                    {week.weekNumber}
                  </div>
                  <div>{week.monthNames}</div>
                  <div></div>
                </div>
                <div
                  className="inline-block"
                  style={{ width: dayWidth * week.days.length + 'px' }}
                >
                  {week.days.map((day, index) => (
                    <div
                      key={index}
                      className={`text-center text-xs border-r-2 inline-block h-6 pt-1 ${
                        day.weekday > 5 ? 'bg-slate-300' : ''
                      }`}
                      style={{ width: dayWidth }}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
