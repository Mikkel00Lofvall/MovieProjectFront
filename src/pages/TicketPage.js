




import "../css/ticket.css"
import ScheduleTable from "../components/schedule";


const TicketPage = ({ scheduleData }) => {
  return (
    <div>
      <ScheduleTable scheduleData={scheduleData}></ScheduleTable>
    </div>
  );
};

export default TicketPage;
