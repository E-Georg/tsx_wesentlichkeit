import axios from 'axios';
import { Cell, ClientTypes, Stakeholder, SubGroup } from '../components/Models/data.interfaces';
import { axiosInstance } from './Axios';

const API_ = 'http://192.168.20.53/wa/api/';
const API = 'http://localhost/wesentlichkeit/backend/api/';
const phpExtension = '.php?param=';

// ========================================== REACT QUERY DATA ==========================================================
// [GET]
export const fetchCellsQuery = async (ClientID: number, GroupID: number): Promise<Cell[]> => {
  let url = `${ClientTypes.Cells}${phpExtension}{ "action":"r", "clientId":${ClientID}, "groupId":${GroupID} }`;

  try {
    const response = await axiosInstance.get<Cell[]>(url);

    if (response.status === 200) return response.data;
  } catch (error) {
    console.error('Error fetching stakeholders:', error);
  }

  return [];
};
// [GET]
export const fetchDataQuery = async (
  typeParameter: string,
  ClientID: number,
  GroupID?: number
): Promise<Stakeholder[] | SubGroup[]> => {
  let url;

  if (GroupID === undefined) {
    url = `${API}${typeParameter}${phpExtension}{ "action":"r", "clientId":${ClientID}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension} { "action":"r", "groupId": ${GroupID}, "clientId":${ClientID} }`;
  }

  try {
    const response = await axios.get(url);
    const fetchedData: Stakeholder[] | SubGroup[] = response.data;

    if (response.status === 200) return fetchedData;
  } catch (error) {
    console.error(`Error fetching ${typeParameter}:`, error);
  }
  return [];
};

// [POST]
export const UpdateCellsToDatabaseQuery = async ({ cell }: any): Promise<Cell[]> => {
  const url = `${API}${ClientTypes.Cell}${phpExtension}{"action":"e","clientStakeholderSignificanceId":${cell.id}, "title":"${cell.message.title}","text":"${cell.message.text}"}`;
  console.log(url);
  try {
    const response = await axios.put(url);
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [POST]
export const UpdateDataToDatabaseQuery = async ({
  matrixObject,
  typeParameter,
  ClientID,
  GroupID = undefined,
}: any): Promise<Stakeholder[] | SubGroup[]> => {
  let url;
  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API}${typeParameter}${phpExtension}{"action":"e", "clientStakeholderId":${matrixObject.id}, "text":"${matrixObject.title}", "description":"${matrixObject.description}", "classification":${matrixObject.classification} }`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"e", "clientSubGroupId": ${matrixObject.id}, "text":"${matrixObject.title}", "description":"${matrixObject.description}", "clientId":${ClientID}, "groupId":${GroupID}  } `;
  }
  try {
    const response = await axios.put(url);
    if (response.status === 200) return matrixObject;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [PUT]
export const AddDataToDataBaseQuery = async ({
  matrixObject,
  typeParameter,
  ClientID,
  GroupID = undefined,
}: any): Promise<Stakeholder[] | SubGroup[]> => {
  let url;

  if (GroupID === undefined) {
    url = `${API}${typeParameter}${phpExtension}{"action":"i","clientId":${ClientID},"text":"${matrixObject.title}","description":"${matrixObject.description}","classification":${matrixObject.classification}}`;
  } else {
    url = `${API}${typeParameter}${phpExtension}{ "action":"i", "groupId": ${GroupID}, "clientId":${ClientID}, "text":"${matrixObject.title}", "description":"${matrixObject.description}" } `;
  }
  console.log(url);
  try {
    const res = await axios.post(url);
    if (res.status === 200) {
      const newSub = { ...matrixObject, id: res.data.lastId };
      return newSub;
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [PUT]
export const AddCellToDataBaseQuery = async ({ cell, ClientID }: any): Promise<Cell[]> => {
  let url = `${API}${ClientTypes.Cell}${phpExtension}{ "action":"i","clientId":${ClientID}, "clientSubGroupId":${cell.clientSubGroupId}, "clientStakeholderId":${cell.clientStakeholderId},"title":"${cell.message.title}", "text":"${cell.message.text}"}`;
  console.log(url);
  try {
    console.log(url);
    const response = await axios.post(url);
    if (response.status === 2000) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [DELETE]
export const DeleteCellFromDatabaseQuery = async ({ ID }: any): Promise<Cell[]> => {
  const url = `${API}${ClientTypes.Cell}${phpExtension}{"action":"d", "clientStakeholderSignificanceId":${ID}}`;
  console.log(url);
  console.log('DRINNEN');
  try {
    const response = await axios.delete(url);
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [DELETE]
export const DeleteDataFromDatabaseQuery = async ({
  matrixObject,
  typeParameter,
}: any): Promise<Stakeholder[] | SubGroup[]> => {
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
  return [];
};
