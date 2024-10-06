/* eslint-disable @typescript-eslint/no-unused-vars */
// "use server";

import axios, { AxiosResponse } from 'axios';
// import { base64ToFile } from '../functions/file-to-base64';
import { CheckAIAPIResponse, uploadAIParams, uploadResponse } from '@/lib/ai-response-type';
// import './envConfig';

// Function to check the AI API status
export async function checkAIAPI(): Promise<CheckAIAPIResponse> {
  const blobAiEndpoint = process.env.NEXT_PUBLIC_AZURE_FUNCTION_CODE;
  const parameterCode = process.env.NEXT_PUBLIC_AZURE_FUNCTION_CODE;

  // Check for missing environment variables
  if (!blobAiEndpoint || !parameterCode) {
    throw new Error('🔴 Missing environment variable');
  }

  const endpointURL = `${blobAiEndpoint}?code=${parameterCode}&is_active=?`;
  try {
    const response: AxiosResponse<CheckAIAPIResponse> = await axios.get(endpointURL);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to upload a file and parameters
export async function psaUploadAI(params: uploadAIParams): Promise<uploadResponse> {
  const blobAiEndpoint = process.env.NEXT_PUBLIC_AZURE_BLOB_AI;
  const parameterCode = process.env.NEXT_PUBLIC_AZURE_FUNCTION_CODE;

  // Check for missing environment variables
  if (!blobAiEndpoint || !parameterCode) {
    throw new Error('🔴 Missing environment variable');
  }

  const { file, doc_type, file_name } = params;


  if (!file || !doc_type || !file_name) {
    throw new Error('Missing required parameters');
  }

  // const file = await base64ToFile(base64File, file_name);

  // Note: FormData may not be available in server-side environments
  // If using Node.js, consider using `form-data` package instead.
  const formData = new FormData();
  formData.append('file', file); // Ensure the file is appended correctly

  const url = `${blobAiEndpoint}?code=${parameterCode}&file_name=${file_name}&document_type=${doc_type}`;
  try {
    const response: AxiosResponse<uploadResponse> = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload file');
  }
}