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
export const fetchDataQuery = async (typeParameter: string, ClientID: number, GroupID?: number): Promise<Stakeholder[] | SubGroup[]> => {
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
  const url = `${API_URL}${ClientTypes.Cell}${PHP_EXTENSION}{"action":"e","clientStakeholderSignificanceId":${cell.id}}`;

  const data = {
    action: 'e',
    clientStakeholderSignificanceId: cell.id,
    messages: cell.message,
  };

  try {
    const response = await axios.put(url, data);
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [POST]
export const UpdateDataToDatabaseQuery = async ({ matrixObject, typeParameter, ClientID, GroupID = undefined }: any): Promise<Stakeholder[] | SubGroup[]> => {
  console.log(matrixObject);

  let params;
  if (GroupID === undefined) {
    params = {
      action: 'e',
      clientStakeholderId: matrixObject.id,
      title: matrixObject.title,
      description: matrixObject.description,
      classification: matrixObject.classification,
      relevance: matrixObject.relevance.value,
      relevanceText: matrixObject.relevance.text,
    };
  } else {
    params = {
      action: 'e',
      clientSubGroupId: matrixObject.id,
      clientId: ClientID,
      title: matrixObject.title,
      description: matrixObject.description,
      groupId: GroupID,
    };
  }

  const url = `${API_URL}${typeParameter}${PHP_EXTENSION}`;

  console.log(url);
  try {
    const response = await axios.put(url, JSON.stringify(params));
    if (response.status === 200) return matrixObject;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [POST]
export const UpdateSubStakeholderToDatabaseQuery = async ({ newStakeholder }: any) => {
  let url;
  console.log(newStakeholder);
  url = `${API_URL}${ClientTypes.SubStakeholder}${PHP_EXTENSION}{"action":"e", "clientSubStakeholderId": ${newStakeholder.id},"name": "${newStakeholder.name}", "email": "${newStakeholder.email}", "stakeholderId": ${newStakeholder.stakeholderId}}`;

  console.log(url);
  try {
    const response = await axios.put(url);
    console.log(response);
    if (response.status === 200) return newStakeholder;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [PUT]
export const AddSubStakeholderToDataBaseQuery = async ({ newStakeholder }: any): Promise<SubStakeholder[] | any> => {
  let url;
  console.log(newStakeholder);
  url = `${API_URL}${ClientTypes.SubStakeholder}${PHP_EXTENSION}{"action":"i", "name": "${newStakeholder.name}", "email": "${newStakeholder.email}", "stakeholderId": ${newStakeholder.stakeholderId}}`;
  console.log(url);
  try {
    const res = await axios.post(url);
    if (res.status === 200) {
      const newSub = { ...newStakeholder, id: res.data.lastId };
      return newSub;
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// [PUT]
export const AddDataToDataBaseQuery = async ({ matrixObject, typeParameter, ClientID, GroupID = undefined }: any): Promise<Stakeholder[] | SubGroup[]> => {
  console.log(matrixObject);

  let params;
  if (GroupID === undefined) {
    params = {
      action: 'i',
      clientId: ClientID,
      title: matrixObject.title,
      description: matrixObject.description,
      classification: matrixObject.classification,
      relevance: matrixObject.relevance.value,
      relevanceText: matrixObject.relevance.text,
    };
  } else {
    params = {
      action: 'i',
      groupId: GroupID,
      clientId: ClientID,
      title: matrixObject.title,
      description: matrixObject.description,
    };
  }

  let url = `${API_URL}${typeParameter}`;
  console.log(JSON.stringify(params));

  try {
    const res = await axios.post(url, JSON.stringify(params));
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
  let url = `${API_URL}${ClientTypes.Cell}${PHP_EXTENSION}`;

  const data = {
    action: 'i',
    clientId: ClientID,
    clientSubGroupId: cell.clientSubGroupId,
    clientStakeholderId: cell.clientStakeholderId,
    messages: cell.message,
  };

  try {
    const response = await axios.post(url, data);
    if (response.status === 2000) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [DELETE]
export const DeleteSubStakeholderFromDatabaseQuery = async (ID: number) => {
  const url = `${API_URL}${ClientTypes.SubStakeholder}${PHP_EXTENSION}{"action":"d", "clientSubStakeholderId":${ID}}`;
  try {
    const response = await axios.delete(url);
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [DELETE]
export const DeleteCellFromDatabaseQuery = async ({ ID }: { ID: number }): Promise<Cell[]> => {
  const url = `${API_URL}${ClientTypes.Cell}${PHP_EXTENSION}{"action":"d", "clientStakeholderSignificanceId":${ID}}`;
  const data = {
    action: 'd',
    clientStakeholderSignificanceId: ID,
  };
  try {
    const response = await axios.delete(url, { data });
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
}: {
  matrixObject: any;
  typeParameter: ClientTypes;
}): Promise<Stakeholder[] | SubGroup[]> => {
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

// [DELETE]
export const DeleteMessageFromCell = async (ID: number) => {
  const url = `${API_URL}cellMessage.php`;

  const data = { action: 'd', cellDataTextId: ID };
  try {
    const response = await axios.delete(url, { data });
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};
