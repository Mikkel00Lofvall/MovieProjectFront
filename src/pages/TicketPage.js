




import "../css/ticket.css"
import ScheduleTable from "../components/schedule";


const TicketPage = ( { fetchedData, MovieID } ) => {
  return (

    <div>
        <ScheduleTable scheduleData={fetchedData} schedulelink={"/seat-selector/"}></ScheduleTable>
    </div>
  );
};

export default TicketPage;
