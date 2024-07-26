import axios from 'axios';
import { Cell, ClientTypes, Group, Stakeholder, SubStakeholder } from '../components/Models/data.interfaces';
import { axiosInstance } from './Axios';

const PHP_EXTENSION = import.meta.env.VITE_PHP_EXTENSION;
const API_URL = import.meta.env.VITE_API_URL;

// ========================================== REACT QUERY DATA ==========================================================
// [GET]
export const fetchCellsQuery = async (ClientID: number): Promise<Cell[]> => {
  let url = `${API_URL}${ClientTypes.Cells}${PHP_EXTENSION}{ "action":"r", "clientId":${ClientID} }`;
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
export const fetchDataQuery = async (typeParameter: string, ClientID: number): Promise<Stakeholder[] | Group[]> => {
  let url;
  url = `${API_URL}${typeParameter}${PHP_EXTENSION}{"action":"r", "clientId":${ClientID}}`;

  console.log(url);
  try {
    const response = await axios.get(url);
    const fetchedData: Stakeholder[] | Group[] = response.data;

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
  const url = `${API_URL}${ClientTypes.Cell}`;

  const data = {
    clientStakeholderSignificanceId: cell.id,
    messages: cell.message,
  };

  console.log(data);
  console.log(url);

  try {
    const response = await axios.put(url, data);
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return [];
};

// [POST]
export const UpdateDataToDatabaseQuery = async ({ matrixObject, typeParameter, ClientID }: any): Promise<Stakeholder[] | Group[]> => {
  console.log(matrixObject);

  let params;
  if (typeParameter === ClientTypes.Stakeholders) {
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
      clientGroupId: matrixObject.id,
      clientId: ClientID,
      title: matrixObject.title,
      description: matrixObject.description,
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
export const AddDataToDataBaseQuery = async ({ matrixObject, typeParameter, ClientID }: any): Promise<Stakeholder[] | Group[]> => {
  console.log(matrixObject);

  let params;
  if (typeParameter === ClientTypes.Stakeholders) {
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
  let url = `${API_URL}${ClientTypes.Cell}`;

  const data = {
    clientId: ClientID,
    clientGroupId: cell.clientGroupId,
    clientStakeholderId: cell.clientStakeholderId,
    messages: cell.message,
  };
  console.log(url);
  console.log(data);

  try {
    const response = await axios.post(url, data);
    console.log(response);
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
    clientStakeholderSignificanceId: ID,
  };

  console.log(url);
  console.log(data);
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
}): Promise<Stakeholder[] | Group[]> => {
  let url;

  if (typeParameter === ClientTypes.Stakeholders) {
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{"action":"d","clientStakeholderId":${matrixObject.id}}`;
  } else {
    url = `${API_URL}${typeParameter}${PHP_EXTENSION}{ "action":"d", "clientGroupId": ${matrixObject.id} }`;
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
