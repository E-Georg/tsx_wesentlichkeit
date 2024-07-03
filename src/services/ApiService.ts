import axios from "axios";
import {
  Cell,
  ClientTypes,
  Stackholder,
  SubGroup,
} from "../utils/data.interfaces";

const API = "http://192.168.20.53/wa/api/";
const phpExtension = ".php?param=";

// Fetch data from the API
export const fetchCells = async (
  typeParameter: string,
  clientID: number,
  groupID: number,
  setCells: (cell: Cell[]) => void
): Promise<void> => {
  // einzelne Zelle auslesen.
  //let url = `${API}${typeParameter}${phpExtension}{%20%22action%22:%22r%22,%22clientId%22:${clientID},%20%22clientSubGroupId%22:2,%20%22clientStakeholderId%22:2%20}`;
  let url = `${API}${typeParameter}${phpExtension}{ "action":"r", "clientId":${clientID}, "groupId":${groupID} }`;
  console.log(url);
  try {
    const response = await axios.get<Cell[]>(url);
    const fetchedCells: Cell[] = response.data;
    console.log(fetchedCells);
    setCells(fetchedCells);
  } catch (error) {
    console.error("Error fetching stackholders:", error);
  }
};

export const convertCellToSubGroup = (cell: Cell): SubGroup => {
  return {
    id: cell.id,
    text: `${cell.clientStakeholderId}.${cell.clientSubGroupId}`,
    description: "",
  };
};

export const fetchData = async (
  typeParameter: string,
  setData: (data: Stackholder[] | SubGroup[]) => void,
  clientID: number,
  groupID?: number
): Promise<void> => {
  let url;

  if (groupID === undefined) {
    console.log("Test");
    url = `${API}${typeParameter}${phpExtension}{ "action":"r", "clientId":${clientID}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension} { "action":"r", "groupId": ${groupID}, "clientId":${clientID} }`;
  }

  try {
    const response = await axios.get(url);
    const fetchedData: Stackholder[] | SubGroup[] = response.data;

    console.log(fetchedData);

    setData(fetchedData);
  } catch (error) {
    console.error(`Error fetching ${typeParameter}:`, error);
  }
};

// TO POST DATA

export const AddCellToDatabase = async (
  cell: Cell,
  clientID: number,
  groupID: number
) => {
  let type = ClientTypes.Cell;
  console.log(cell);

  let url = `${API}${type}${phpExtension}{%20%22action%22:%22i%22,%22clientId%22:${clientID},%20%22clientSubGroupId%22:${cell.clientSubGroupId},%20%22clientStakeholderId%22:${cell.clientStakeholderId},%22title%22:"${cell.message.title}",%20%22text%22:"${cell.message.text}"}`;
  // url = `http://192.168.20.53/wa/api/clientStakeholderSignificance.php?param={%20%22action%22:%22i%22,%22clientId%22:1,%20%22clientSubGroupId%22:143,%20%22clientStakeholderId%22:2,%22title%22:%22Marktsituation%22,%20%22text%22:%22ist%20ok%22%20}`;
  try {
    console.log(url);
    const response = await axios.post(url, cell);
    // handle response here
    return response.status;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const AddDataToDatabase = async (
  matrixObject: SubGroup | Stackholder,
  typeParameter: string,
  clientID: number,
  groupID?: number
) => {
  let url;
  console.log(matrixObject);
  if (groupID === undefined) {
    url = `${API}${typeParameter}${phpExtension}{"action":"i","clientId":${clientID},"text":"${matrixObject.text}","description":"${matrixObject.description}","classification":2}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"i", "groupId": ${groupID}, "clientId":${clientID}, "text":"${matrixObject.text}", "description":"${matrixObject.description}" } `;
  }
  try {
    console.log(url);
    const response = await axios.post(url);
    // handle response here
    console.log(response.data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// UPDATE DATA
export const UpdateDataToDatabase = async (
  matrixObject: SubGroup | Stackholder,
  typeParameter: string,
  clientID: number,
  groupID?: number
) => {
  let url;
  console.log(matrixObject);
  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"e", "clientStakeholderId":${matrixObject.id}, "text":"${matrixObject.text}", "description":"${matrixObject.description}"}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"e", "clientSubGroupId": ${matrixObject.id}, "text":"${matrixObject.text}", "description":"${matrixObject.description}", "clientId":${clientID}, "groupId":${groupID}  } `;
  }
  try {
    console.log(url);
    const response = await axios.put(url);
    // handle response here
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// DELETE DATA

export const DeleteDataFromDatabase = async (
  id: number,
  typeParameter: string
) => {
  let url;

  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"d","clientStakeholderId":${id}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"d", "clientSubGroupId": ${id} }`;
  }

  try {
    console.log(url);
    const response = await axios.delete(url);
    // handle response here
    console.log(response.data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};
