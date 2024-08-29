export function showBackButton(weekData) {
    let today = new Date();
    for (let date of weekData) {
        if (date.toDateString() === today.toDateString()) {
            return {
                isCurrentWeek: true,
                left: false,
                right: false
            };
        }
    }
    if (today > weekData[6]) {
        return { isCurrentWeek: false, left: false, right: true };
    } else if (today < weekData[0]) {
        return { isCurrentWeek: false, left: true, right: false };
    }
}
