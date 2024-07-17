import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import "./Dropdown.css";

interface Props {
  stakeholderID: number;
}
const Dropdown = ({ stakeholderID }: Props) => {
  const { SubStakeholder } = useStore();
  const navigate = useNavigate();

  return (
    <div className="dropdown-container">
      <select>
        {SubStakeholder.map((option: any, index: any) => {
          console.log(stakeholderID);
          // show option.name if option.id is the same as stakeholderID
          return (
            <option key={index} value={option.name}>
              {option.name}
            </option>
          );
        })}
      </select>

      <button
        onClick={() =>
          navigate("/stakeholderlist", { state: { from: "modal" } })
        }
      >
        Go to Stakeholder List
      </button>
    </div>
  );
};

export default Dropdown;
