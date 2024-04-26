import { Document, Model } from "mongoose";


interface MonthData{
    month: string;
    count: number;
}

export async function gererateLast12MonthsData<T extends Document>(model: Model<T>): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 11; i >= 0; i--){
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0
      ); // Set endDate to the last day of the current month
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      ); // Set startDate to the first day of the previous month
      
      const monthYear = endDate.toLocaleDateString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const count = await model.countDocuments({
        createdAt: {
          $gt: startDate,
          $lt: endDate,
        },
      });
      last12Months.push({ month: monthYear, count });
    }
    return { last12Months };
}



