import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSimpleToast = (message, type = "success") => {
  toast[type](message, {
    style: {
      background: "#000",
      color: "#fff",
    },
    position: "bottom-right",
    pauseOnHover: true,
    draggable: true,
    hideProgressBar: true,
    autoClose: 1000,
  });
};
