import axios from "axios";
import { Cell, Stackholder, SubGroup } from "../utils/data.interfaces";

const API = "http://192.168.20.53/wa/api/";
let phpExtension = ".php?param={";

// Fetch data from the API
export const fetchCells = async (
  setCells: (cell: Cell[]) => void
): Promise<void> => {
  try {
    const response = await axios.get<Cell[]>(
      "http://192.168.20.53/wa/api/clientStakeholderSignificance.php?param=%7B%20%22clientId%22:2,%20%22clientSubGroupId%22:6,%20%22clientStakeholderId%22:6%20%7D"
    );
    const fetchedStackholders: Cell[] = response.data;
    // Set the fetched stackholders to the state

    //console.log(fetchedStackholders);
    setCells(fetchedStackholders);
  } catch (error) {
    console.error("Error fetching stackholders:", error);
  }
};

export const fetchData = async (
  typeParameter: string,
  setData: any,
  clientID: number | null,
  groupID: number | null
): Promise<void> => {
  try {
    let type = typeParameter;
    let apiLink = API + type + phpExtension;

    if (clientID !== null) {
      apiLink += `"clientId":${clientID.toString()}`;
    }
    if (clientID !== null && groupID !== null) {
      apiLink += ",";
    }
    if (groupID !== null) {
      apiLink += `"groupId":${groupID.toString()}`;
    }
    // Remove trailing comma and close the JSON object
    apiLink = apiLink + "}";
    const response = await axios.get(apiLink);
    const fetchedData = response.data;
    // Set the fetched data to the state
    setData(fetchedData);
  } catch (error) {
    console.error(`Error fetching ${typeParameter}:`, error);
  }
};

// TO SEND DATA

// UPDATE DATA

// DELETE DATA
