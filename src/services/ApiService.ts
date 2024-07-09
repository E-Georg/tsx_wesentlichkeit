import axios from 'axios';
import { Cell, ClientTypes, Stackholder, SubGroup } from '../utils/data.interfaces';

const API = 'http://192.168.20.53/wa/api/';
const phpExtension = '.php?param=';

// ========================================== REACT QUERY DATA ==========================================================
// [GET]
export const fetchCellsQuery = async (ClientID: number, GroupID: number) => {
  let url = `${API}${ClientTypes.Cells}${phpExtension}{ "action":"r", "clientId":${ClientID}, "groupId":${GroupID} }`;

  try {
    const response = await axios.get<Cell[]>(url);
    // const fetchedCells: Cell[] = response.data;

    if (response.status === 200) return response.data;
  } catch (error) {
    console.error('Error fetching stackholders:', error);
  }
};
// [GET]
export const fetchDataQuery = async (typeParameter: string, ClientID: number, GroupID?: number): Promise<any> => {
  let url;

  if (GroupID === undefined) {
    url = `${API}${typeParameter}${phpExtension}{ "action":"r", "clientId":${ClientID}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension} { "action":"r", "groupId": ${GroupID}, "clientId":${ClientID} }`;
  }

  try {
    const response = await axios.get(url);
    const fetchedData: Stackholder[] | SubGroup[] = response.data;

    return fetchedData;
  } catch (error) {
    console.error(`Error fetching ${typeParameter}:`, error);
  }
};

// [POST]
export const UpdateCellsToDatabaseQuery = async ({ cell }: any) => {
  const url = `${API}${ClientTypes.Cell}${phpExtension}{"action":"e","clientStakeholderSignificanceId":${cell.id}, "title":"${cell.message.title}","text":"${cell.message.text}"}`;
  console.log(url);
  try {
    const response = await axios.put(url);
    console.log(response);
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// [POST]
export const UpdateDataToDatabaseQuery = async ({
  matrixObject,
  typeParameter,
  ClientID,
  GroupID = undefined,
}: any) => {
  let url;
  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"e", "clientStakeholderId":${matrixObject.id}, "text":"${matrixObject.text}", "description":"${matrixObject.description}"}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"e", "clientSubGroupId": ${matrixObject.id}, "text":"${matrixObject.text}", "description":"${matrixObject.description}", "clientId":${ClientID}, "groupId":${GroupID}  } `;
  }
  try {
    const response = await axios.put(url);
    if (response.status === 200) return matrixObject;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// [PUT]
export const AddDataToDataBaseQuery = async ({ matrixObject, typeParameter, ClientID, GroupID = undefined }: any) => {
  let url;

  if (GroupID === undefined) {
    url = `${API}${typeParameter}${phpExtension}{"action":"i","clientId":${ClientID},"text":"${matrixObject.text}","description":"${matrixObject.description}","classification":2}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"i", "groupId": ${GroupID}, "clientId":${ClientID}, "text":"${matrixObject.text}", "description":"${matrixObject.description}" } `;
  }

  try {
    const res = await axios.post(url);
    if (res.status === 200) {
      const newSub = { ...matrixObject, id: res.data.lastId };
      return newSub;
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// [PUT]
export const AddCellToDataBaseQuery = async ({ cell, ClientID }: any) => {
  let url = `${API}${ClientTypes.Cell}${phpExtension}{ "action":"i","clientId":${ClientID}, "clientSubGroupId":${cell.clientSubGroupId}, "clientStakeholderId":${cell.clientStakeholderId},"title":"${cell.message.title}", "text":"${cell.message.text}"}`;
  console.log(url);
  try {
    console.log(url);
    const response = await axios.post(url);
    if (response.status === 2000) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// [DELETE]
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

// [DELETE]
export const DeleteDataFromDatabaseQuery = async ({ matrixObject, typeParameter }: any) => {
  let url;

  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"d","clientStakeholderId":${matrixObject.id}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"d", "clientSubGroupId": ${matrixObject.id} }`;
  }

  try {
    const response = await axios.delete(url);
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

/*
 * @deprecated This function is not used. Do not use it.
 */
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
// ========================================== POST DATA ==========================================================

/*
 * @deprecated This function is not used. Do not use it.
 */
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

/*
 * @deprecated This function is not used. Do not use it.
 */
export const UpdateCellToDatabase = async (cell: Cell, cellId: number) => {
  const url = `${API}${ClientTypes.Cell}${phpExtension}{"action":"e","clientStakeholderSignificanceId":${cellId}, "title":"${cell.message.title}","text":"${cell.message.text}"}`;
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

/*
 * @deprecated This function is not used. Do not use it.
 */
export const DeleteCellFromDatabase = async (id: number) => {
  const url = `${API}${ClientTypes.Cell}${phpExtension}{"action":"d", "clientStakeholderSignificanceId":${id}}`;

  try {
    const response = await axios.delete(url);
    return response.status;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const convertCellToSubGroup = (cell: Cell): SubGroup => {
  return {
    id: cell.id,
    text: `${cell.clientStakeholderId}.${cell.clientSubGroupId}`,
    description: '',
  };
};
