/* eslint-disable @typescript-eslint/no-unused-vars */
export interface CheckAIAPIResponse {
    status: string;
    version: string;
    uptime: number;
    // Add more fields based on the actual response structure
 }
 
 export interface uploadAIParams {
    file: File;
    file_name: string;
    doc_type: string;
  }
 
  // Generic interface for AI Response
 export interface uploadResponse<T = Record<string, unknown>> {
    // success: boolean;
    // message: string;
    data: uploadDataItems;
  }
 
   // Generalized DataItems interface with constrained generic
 export interface uploadDataItems {
    filename: string;
    content_type: string;
    size_mb: number;
    uploaded_at: string; // Date in ISO format
    url: string;
    sas_url: string;
    ai_check: aiChecking; // Dynamic properties stored under a generic metadata field
  }
 
  export interface aiChecking {
    is_true_copy: boolean | null;
    explanation: string | null;
  }
 
 /** ----------  AI API Response Example  ----------
    data: {
      filename: "document.pdf",
      content_type: "application/pdf",
      size_mb: 2.5,
      uploaded_at: new Date().toISOString(),
      url: "https://example.com/document.pdf",
      sas_url: "https://example.com/document.pdf?sasToken=xyz",
      metadata: {
        is_psa_certificate: true,
        explanation: "This is a valid PSA birth certificate."
      }
    }
 */
 