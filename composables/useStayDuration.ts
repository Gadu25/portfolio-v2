type WorkPeriod = {
    start: string;
    end?: string;
};

const toMonthYear = (date: string): string => {
    if (date.includes('/')) return date
    const d = new Date(date)
    return `${d.getMonth() + 1}/${d.getFullYear()}`
}

export const useStayDuration = () => {
    const getStayDuration = (work: WorkPeriod): string => {
        const currentDate = new Date();
        const endRaw = work.end
            ? toMonthYear(work.end)
            : `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        const startRaw = toMonthYear(work.start);

        const start = startRaw.split("/");
        const end = endRaw.split("/");

        const startMonth = parseInt(start[0]);
        const startYear = parseInt(start[1]);

        const endMonth = parseInt(end[0]);
        const endYear = parseInt(end[1]);

        let yearDiff = endYear - startYear;
        let monthDiff = endMonth - startMonth;

        if (monthDiff < 0) {
            yearDiff -= 1;
            monthDiff += 12;
        }

        const yearPhrase =
            yearDiff > 1 ? `${yearDiff} years` : yearDiff === 1 ? "1 year" : "";
        const monthPhrase =
            monthDiff > 1 ? `${monthDiff} months` : monthDiff === 1 ? "1 month" : "";

        if (yearPhrase && monthPhrase) {
            return `${yearPhrase} and ${monthPhrase}`;
        } else if (yearPhrase) {
            return yearPhrase;
        } else if (monthPhrase) {
            return monthPhrase;
        } else {
            return "0 months";
        }
    };

    return {
        getStayDuration,
    };
};
