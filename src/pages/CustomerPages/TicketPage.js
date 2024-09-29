




import "../../css/CustomerCSS/ticket.css"
import ScheduleTable from "../../components/schedule"


const TicketPage = ( { fetchedData, link } ) => {
  return (
    <ScheduleTable scheduleData={fetchedData} schedulelink={link}></ScheduleTable>
  );
};

export default TicketPage;
