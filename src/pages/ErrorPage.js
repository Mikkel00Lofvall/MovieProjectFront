import "../css/error.css"
import { useNavigate, useParams } from "react-router-dom";


const ErrorPage = () => {
    const navigate = useNavigate();
    let { errorCode } = useParams();
    return (
      <div className="page-error-frame">
        <h2>Error {errorCode}</h2>
        <label>It looks like you tried to reach a non existing site or the information could not be collected from the server</label>
        <button onClick={() => {navigate("/")}}>Return</button>
      </div>
      
    );
  };
  
  export default ErrorPage;