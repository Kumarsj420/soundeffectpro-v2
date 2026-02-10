import Category from '@/app/models/Category';
import {
    getWeekStart,
    getMonthStart,
    getHalfYearStart
} from '@/app/lib/statsPeriod';

type CategoryStatType = 'views' | 'reports';

export async function incrementCategoryStat(
    sb_id: string,
    stat: CategoryStatType
) {

    const weekStart = getWeekStart();
    const monthStart = getMonthStart();
    const halfYearStart = getHalfYearStart();

    const updatePipeline: any[] = [

        {
            $set: {

                "stats.weekly": {
                    $cond: [
                        { $lt: ["$stats.weekly.periodStart", weekStart] },
                        { views: 0, periodStart: weekStart },
                        "$stats.weekly"
                    ]
                },

                "stats.monthly": {
                    $cond: [
                        { $lt: ["$stats.monthly.periodStart", monthStart] },
                        { views: 0, periodStart: monthStart },
                        "$stats.monthly"
                    ]
                },

                "stats.halfYearly": {
                    $cond: [
                        { $lt: ["$stats.halfYearly.periodStart", halfYearStart] },
                        { views: 0, periodStart: halfYearStart },
                        "$stats.halfYearly"
                    ]
                }

            }
        }
    ];


    if (stat === 'views') {
        updatePipeline.push({
            $set: {
                "stats.views": { $add: ["$stats.views", 1] },
                "stats.weekly.views": { $add: ["$stats.weekly.views", 1] },
                "stats.monthly.views": { $add: ["$stats.monthly.views", 1] },
                "stats.halfYearly.views": { $add: ["$stats.halfYearly.views", 1] }
            }
        });
    }

    if (stat === 'reports') {
        updatePipeline.push({
            $set: {
                "stats.reports": { $add: ["$stats.reports", 1] }
            }
        });
    }


    const updatedCategory = await Category.findOneAndUpdate(
        { sb_id },
        updatePipeline,
        { new: true }
    );

    return updatedCategory;
}
