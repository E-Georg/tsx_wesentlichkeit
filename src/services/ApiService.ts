import axios from 'axios';
import { Cell, ClientTypes, Stackholder, SubGroup } from '../utils/data.interfaces';
import { useStore } from '../store';

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

export const fetchCellsQuery = async (clientID: number, groupID: number) => {
  let url = `${API}${ClientTypes.Cells}${phpExtension}{ "action":"r", "clientId":${clientID}, "groupId":${groupID} }`;

  try {
    const response = await axios.get<Cell[]>(url);
    // const fetchedCells: Cell[] = response.data;

    if (response.status === 200) return response.data;
  } catch (error) {
    console.error('Error fetching stackholders:', error);
  }
};

export const DeleteCellFromDatabaseQuery = async ({ ID }: any) => {
  const url = `${API}${ClientTypes.Cell}${phpExtension}{"action":"d", "clientStakeholderSignificanceId":${ID}}`;
  console.log(ID);
  try {
    const response = await axios.delete(url);
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const fetchDataQuery = async (typeParameter: string, clientID: number, groupID?: number): Promise<any> => {
  let url;

  if (groupID === undefined) {
    url = `${API}${typeParameter}${phpExtension}{ "action":"r", "clientId":${clientID}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension} { "action":"r", "groupId": ${groupID}, "clientId":${clientID} }`;
  }
  console.log(url);

  try {
    const response = await axios.get(url);
    const fetchedData: Stackholder[] | SubGroup[] = response.data;

    return fetchedData;
  } catch (error) {
    console.error(`Error fetching ${typeParameter}:`, error);
  }
};
export const DeleteDataFromDatabaseQuery = async ({ matrixObject, typeParameter }: any) => {
  let url;

  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"d","clientStakeholderId":${matrixObject.id}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"d", "clientSubGroupId": ${matrixObject.id} }`;
  }

  console.log(url);
  try {
    const response = await axios.delete(url);
    if (response.status === 200) return matrixObject;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const AddDataToDataBaseQuery = async ({ matrixObject, typeParameter, clientID, groupID = undefined }: any) => {
  let url;
  console.log(matrixObject);

  if (groupID === undefined) {
    url = `${API}${typeParameter}${phpExtension}{"action":"i","clientId":${clientID},"text":"${matrixObject.text}","description":"${matrixObject.description}","classification":2}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"i", "groupId": ${groupID}, "clientId":${clientID}, "text":"${matrixObject.text}", "description":"${matrixObject.description}" } `;
  }

  console.log(url);
  try {
    const res = await axios.post(url);
    console.log(res);
    if (res.status === 200) {
      const newSub = { ...matrixObject, id: res.data.lastId };
      return newSub;
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const UpdateDataToDatabaseQuery = async ({
  matrixObject,
  typeParameter,
  clientID,
  groupID = undefined,
}: any) => {
  let url;
  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"e", "clientStakeholderId":${matrixObject.id}, "text":"${matrixObject.text}", "description":"${matrixObject.description}"}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"e", "clientSubGroupId": ${matrixObject.id}, "text":"${matrixObject.text}", "description":"${matrixObject.description}", "clientId":${clientID}, "groupId":${groupID}  } `;
  }
  try {
    const response = await axios.put(url);
    console.log(response);
    if (response.status === 200) return matrixObject;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// ========================================== GET DATA ==========================================================
/*
 * @deprecated This function is not used. Do not use it.
 */
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

/*
 * @deprecated This function is not used. Do not use it.
 */
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

  console.log(url);
  try {
    const response = await axios.post(url);
    return response.status;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// // ========================================== UPDATE DATA ==========================================================
/*
 * @deprecated This function is not used. Do not use it.
 */
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

export const UpdateCellToDatabase = async (cell: Cell, cellId: number) => {
  const url = `${API}${ClientTypes.Cell}${phpExtension}{"action":"e","clientStakeholderSignificanceId":${cellId}, "title":"${cell.message.title}","text":"${cell.message.text}"}`;
  console.log(url);
  try {
    const response = await axios.put(url);
    return response.status;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// ========================================== DELETE DATA ==========================================================
/*
 * @deprecated This function is not used. Do not use it.
 */
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

export const DeleteCellFromDatabase = async (id: number) => {
  const url = `${API}${ClientTypes.Cell}${phpExtension}{"action":"d", "clientStakeholderSignificanceId":${id}}`;

  try {
    const response = await axios.delete(url);
    return response.status;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};
