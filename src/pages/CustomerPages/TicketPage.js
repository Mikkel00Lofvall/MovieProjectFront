




import "../../css/CustomerCSS/ticket.css"
import ScheduleTable from "../../components/schedule"


const TicketPage = ( { fetchedData, MovieID } ) => {
  return (
    <ScheduleTable scheduleData={fetchedData} schedulelink={"/seat-selector/"}></ScheduleTable>
  );
};

export default TicketPage;
