type WorkPeriod = {
    start: string; // Format: "MM/YYYY"
    end?: string; // Format: "MM/YYYY" or undefined for ongoing work
  };
  
  export const useStayDuration = () => {
    const getStayDuration = (work: WorkPeriod): string => {
      const currentDate = new Date();
      const end = work.end
        ? work.end.split("/")
        : [String(currentDate.getMonth() + 1), String(currentDate.getFullYear())]; // Use current date if no end date
      const start = work.start.split("/");
  
      const startMonth = parseInt(start[0]);
      const startYear = parseInt(start[1]); 
  
      const endMonth = parseInt(end[0]);
      const endYear = parseInt(end[1]);
  
      // Calculate year and month difference
      let yearDiff = endYear - startYear;
      let monthDiff = endMonth - startMonth;
  
      // Adjust for negative month difference
      if (monthDiff < 0) {
        yearDiff -= 1;
        monthDiff += 12;
      }
  
      // Build the result phrases
      const yearPhrase =
        yearDiff > 1 ? `${yearDiff} years` : yearDiff === 1 ? "1 year" : "";
      const monthPhrase =
        monthDiff > 1 ? `${monthDiff} months` : monthDiff === 1 ? "1 month" : "";
  
      // Combine the phrases
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
  