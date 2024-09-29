import AdminMenu from "../../components/adminMenu";
import "../../css/AdminCSS/AdminRoomPanel.css"
import Breakline from "../../components/breakline";


const AdminRoomPage = () => {
  
    return (
      <div className="page-admin-frame">
        <AdminMenu></AdminMenu>
        <section className="page-admin-header">
          <h2>Room Panel</h2>
        </section>


        <Breakline></Breakline>
        <section className="page-admin-tool-button-bundle">
          <button className="page-admin-tool-button-create">Create</button>
        </section>
        <main className="page-admin-room-container">
          <div className="show-scrollbar">

          </div>
        </main>
      </div>
    )
  };
  
  export default AdminRoomPage;