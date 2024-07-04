import axios from 'axios';
import { Cell, ClientTypes, Stackholder, SubGroup } from '../utils/data.interfaces';

const API = 'http://192.168.20.53/wa/api/';
const phpExtension = '.php?param=';

// ========================================== GET DATA ==========================================================
export const fetchCells = async (
  typeParameter: string,
  clientID: number,
  groupID: number,
  setCells: (cell: Cell[]) => void
): Promise<any> => {
  let url = `${API}${typeParameter}${phpExtension}{ "action":"r", "clientId":${clientID}, "groupId":${groupID} }`;

  try {
    const response = await axios.get<Cell[]>(url);
    const fetchedCells: Cell[] = response.data;

    if (response.status === 200) setCells(fetchedCells);
  } catch (error) {
    console.error('Error fetching stackholders:', error);
  }
};

export const convertCellToSubGroup = (cell: Cell): SubGroup => {
  return {
    id: cell.id,
    text: `${cell.clientStakeholderId}.${cell.clientSubGroupId}`,
    description: '',
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
    url = `${API}${typeParameter}${phpExtension}{ "action":"r", "clientId":${clientID}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension} { "action":"r", "groupId": ${groupID}, "clientId":${clientID} }`;
  }

  try {
    const response = await axios.get(url);
    const fetchedData: Stackholder[] | SubGroup[] = response.data;

    if (response.status === 200) setData(fetchedData);
  } catch (error) {
    console.error(`Error fetching ${typeParameter}:`, error);
  }
};

// ========================================== POST DATA ==========================================================

export const AddCellToDatabase = async (cell: Cell, clientID: number) => {
  let url = `${API}${ClientTypes.Cell}${phpExtension}{ "action":"i","clientId":${clientID}, "clientSubGroupId":${cell.clientSubGroupId}, "clientStakeholderId":${cell.clientStakeholderId},"title":"${cell.message.title}", "text":"${cell.message.text}"}`;
  try {
    const response = await axios.post(url, cell);

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
  if (groupID === undefined) {
    url = `${API}${typeParameter}${phpExtension}{"action":"i","clientId":${clientID},"text":"${matrixObject.text}","description":"${matrixObject.description}","classification":2}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"i", "groupId": ${groupID}, "clientId":${clientID}, "text":"${matrixObject.text}", "description":"${matrixObject.description}" } `;
  }
  try {
    const response = await axios.post(url);
    return response.status;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// // ========================================== UPDATE DATA ==========================================================
export const UpdateDataToDatabase = async (
  matrixObject: SubGroup | Stackholder,
  typeParameter: string,
  clientID: number,
  groupID?: number
) => {
  let url;
  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"e", "clientStakeholderId":${matrixObject.id}, "text":"${matrixObject.text}", "description":"${matrixObject.description}"}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"e", "clientSubGroupId": ${matrixObject.id}, "text":"${matrixObject.text}", "description":"${matrixObject.description}", "clientId":${clientID}, "groupId":${groupID}  } `;
  }
  try {
    const response = await axios.put(url);
    return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// ========================================== DELETE DATA ==========================================================

export const DeleteDataFromDatabase = async (id: number, typeParameter: string) => {
  let url;

  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"d","clientStakeholderId":${id}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"d", "clientSubGroupId": ${id} }`;
  }

  try {
    const response = await axios.delete(url);
    return response.status;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};
