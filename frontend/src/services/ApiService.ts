import axios from 'axios';
import { Cell, ClientTypes, Stakeholder, SubGroup, SubStakeholder } from '../components/Models/data.interfaces';
import { axiosInstance } from './Axios';

const PHP_EXTENSION = import.meta.env.VITE_PHP_EXTENSION;
const API_URL = import.meta.env.VITE_API_URL;

// ========================================== REACT QUERY DATA ==========================================================
// [GET]
export const fetchCellsQuery = async (ClientID: number, GroupID: number): Promise<Cell[]> => {
  let url = `${API_URL}${ClientTypes.Cells}${PHP_EXTENSION}{ "action":"r", "clientId":${ClientID}, "groupId":${GroupID} }`;
  console.log(url);
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
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{ "action":"r", "clientId":${ClientID}}`;
  } else {
    url = `${API_URL}${typeParameter}${PHP_EXTENSION} { "action":"r", "groupId": ${GroupID}, "clientId":${ClientID} }`;
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

// [GET]
export const fetchDataQuerySubStakeholder = async (): Promise<SubStakeholder[]> => {
  // get all SubStakeHolder
  let url;
  url = `${API_URL}${ClientTypes.SubStakeholder}${PHP_EXTENSION}{"action":"r"}`;
  console.log(url);
  try {
    const response = await axios.get(url);
    const fetchedData: SubStakeholder[] = response.data;

    if (response.status === 200) return fetchedData;
  } catch (error) {
    console.error(`Error fetching:`, error);
  }
  return [];
};

// [POST]
export const UpdateCellsToDatabaseQuery = async ({ cell }: any): Promise<Cell[]> => {
  const url = `${API_URL}${ClientTypes.Cell}${PHP_EXTENSION}{"action":"e","clientStakeholderSignificanceId":${cell.id}, "title":"${cell.message.title}","text":"${cell.message.text}"}`;
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
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{"action":"e", "clientStakeholderId":${matrixObject.id}, "text":"${matrixObject.title}", "description":"${matrixObject.description}", "classification":${matrixObject.classification} }`;
  } else {
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{ "action":"e", "clientSubGroupId": ${matrixObject.id}, "text":"${matrixObject.title}", "description":"${matrixObject.description}", "clientId":${ClientID}, "groupId":${GroupID}  } `;
  }
  console.log(url);
  try {
    const response = await axios.put(url);
    if (response.status === 200) return matrixObject;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [POST]
export const UpdateSubStakeholderToDatabaseQuery = async ({ subStakeholder, CLientID }: any) => {
  let url;
  url = `${API_URL}${ClientTypes.SubStakeholder}${PHP_EXTENSION}{"action":"e", "clientStakeholderId":${subStakeholder.id}, "text":"${subStakeholder.title}", "description":"${subStakeholder.description}" }`;

  console.log(url);
  try {
    const response = await axios.put(url);
    if (response.status === 200) return subStakeholder;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [PUT]
export const AddSubStakeholderToDataBaseQuery = async ({
  substakeholder,
  ClientID,
}: any): Promise<SubStakeholder[] | any> => {
  let url;

  url = `diesdas${ClientID}`;
  console.log(url);
  try {
    const res = await axios.post(url);
    if (res.status === 200) {
      const newSub = { ...substakeholder, id: res.data.lastId };
      return newSub;
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
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
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{"action":"i","clientId":${ClientID},"text":"${matrixObject.title}","description":"${matrixObject.description}","classification":${matrixObject.classification}}`;
  } else {
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{ "action":"i", "groupId": ${GroupID}, "clientId":${ClientID}, "text":"${matrixObject.title}", "description":"${matrixObject.description}" } `;
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
  let url = `${API_URL}${ClientTypes.Cell}${PHP_EXTENSION}{ "action":"i","clientId":${ClientID}, "clientSubGroupId":${cell.clientSubGroupId}, "clientStakeholderId":${cell.clientStakeholderId},"title":"${cell.message.title}", "text":"${cell.message.text}"}`;
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
export const DeleteSubStakeholderFromDatabaseQuery = async ({ ID }: any) => {
  const url = `${API_URL}${ClientTypes.SubStakeholder}${PHP_EXTENSION}{"action":"d", "clientSubStakeholders":${ID}}`;
  try {
    const response = await axiosInstance.delete(url);
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [DELETE]
export const DeleteCellFromDatabaseQuery = async ({ ID }: any): Promise<Cell[]> => {
  const url = `${API_URL}${ClientTypes.Cell}${PHP_EXTENSION}{"action":"d", "clientStakeholderSignificanceId":${ID}}`;
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
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{"action":"d","clientStakeholderId":${matrixObject.id}}`;
  } else {
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{ "action":"d", "clientSubGroupId": ${matrixObject.id} }`;
  }

  try {
    const response = await axios.delete(url);
    if (response.status === 200) return matrixObject;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};
