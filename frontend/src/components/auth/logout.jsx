import { Button } from "../ui/button";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;