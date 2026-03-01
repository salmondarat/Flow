import { CalendarPage } from "@/components/admin/calendar/calendar-page";
import { getCalendarData } from "@/components/admin/calendar/calendar-utils";

export const dynamic = "force-dynamic";

export default async function CalendarPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;

  const today = new Date();
  const dateParam = params.date ? new Date(params.date) : today;

  const year = dateParam.getFullYear();
  const month = dateParam.getMonth() + 1;

  const { days, currentDate } = await getCalendarData(year, month);

  return <CalendarPage days={days} currentDate={currentDate} />;
}
