




import "../css/ticket.css"
import ScheduleTable from "../components/schedule";


const TicketPage = ({ fetchedData }) => {
  console.log("Data: ", fetchedData)
  return (

    <div>
        <ScheduleTable scheduleData={fetchedData} schedulelink={"/seat-selector/"}></ScheduleTable>
    </div>
  );
};

export default TicketPage;
