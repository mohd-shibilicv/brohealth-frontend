import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import activateAccount from "../../services/activateAccount";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ActivationPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const uid = params.get("uid");
  const token = params.get("token");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    activateAccount(uid, token)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  }, [token]);

  return error ? (
    <>
      <div className="flex mx-auto justify-center items-center min-h-screen">
        <div className="font-semibold">Error: {error}</div>
      </div>
    </>
  ) : (
    <>
      <div className="flex mx-auto justify-center items-center min-h-screen">
        <ToastContainer />
        <div
          className="animate-spin w-24 h-24 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default ActivationPage;
