import File from '@/app/models/File';
import {
  getWeekStart,
  getMonthStart,
  getHalfYearStart
} from '@/app/lib/statsPeriod';

type StatType = 'views' | 'likes' | 'downloads';

export async function incrementFileStat(s_id: string, stat: StatType) {

  const weekStart = getWeekStart();
  const monthStart = getMonthStart();
  const halfYearStart = getHalfYearStart();

  const updatedFile = await File.findOneAndUpdate(
    { s_id },
    [

      {
        $set: {

          "stats.weekly": {
            $cond: [
              { $lt: ["$stats.weekly.periodStart", weekStart] },
              {
                views: 0,
                likes: 0,
                downloads: 0,
                periodStart: weekStart
              },
              "$stats.weekly"
            ]
          },


          "stats.monthly": {
            $cond: [
              { $lt: ["$stats.monthly.periodStart", monthStart] },
              {
                views: 0,
                likes: 0,
                downloads: 0,
                periodStart: monthStart
              },
              "$stats.monthly"
            ]
          },

          "stats.halfYearly": {
            $cond: [
              { $lt: ["$stats.halfYearly.periodStart", halfYearStart] },
              {
                views: 0,
                likes: 0,
                downloads: 0,
                periodStart: halfYearStart
              },
              "$stats.halfYearly"
            ]
          }

        }
      },

      {
        $set: {
          [`stats.${stat}`]: { $add: [`$stats.${stat}`, 1] },
          [`stats.weekly.${stat}`]: { $add: [`$stats.weekly.${stat}`, 1] },
          [`stats.monthly.${stat}`]: { $add: [`$stats.monthly.${stat}`, 1] },
          [`stats.halfYearly.${stat}`]: { $add: [`$stats.halfYearly.${stat}`, 1] }
        }
      }

    ],
    { new: true }
  );

  return updatedFile;
}
