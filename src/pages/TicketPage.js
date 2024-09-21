




import "../css/ticket.css"
import ScheduleTable from "../components/schedule";


const TicketPage = ({ movieID }) => {
  return (
    <div>
      <ScheduleTable movieID={movieID}></ScheduleTable>
    </div>
  );
};

export default TicketPage;
