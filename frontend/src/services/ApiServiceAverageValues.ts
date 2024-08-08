import { ClientTypes } from '../components/Models/data.interfaces';
import { checkedBox } from '../components/WesAnListSimple/WesAnListSimple';
import { axiosInstance } from './Axios';

const API_URL = import.meta.env.VITE_API_URL;

// [GET] with postBody
export const fetchSubStakeholderAverageAnswer = async (clientId: number) => {
  const url = `${API_URL}${ClientTypes.SurveyQuestions}`;
  const data = {
    subStakeholder: true,
    clientId: clientId,
  };

  try {
    const res = await axiosInstance.post(url, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// [GET] with postBody
export const fetchSubStakeholderComments = async (clientId: number) => {
  const url = `${API_URL}${ClientTypes.SurveyQuestions}`;
  const data = {
    answererdText: true,
    clientId: clientId,
  };

  try {
    const res = await axiosInstance.post(url, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// [GET] with postBody
export const fetchGroupSubGroupAverageValues = async (clientId: number) => {
  const url = `${API_URL}${ClientTypes.SurveyQuestions}`;
  const data = {
    answererdAverageValues: true,
    clientId: clientId,
  };

  try {
    const res = await axiosInstance.post(url, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// [POST] Null muss bei clientSubGroupId explizit gesetzt weden
export const UpdateRelevanceGroup = async (clientId: number, relevanceObject: checkedBox[]) => {
  const url = `${API_URL}${ClientTypes.Groups}`;
  const data = {
    action: 'er',
    clientId: clientId,
    relevanceItem: relevanceObject,
  };
  console.log(url);
  console.log(data);

  try {
    const res = await axiosInstance.post(url, data);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
