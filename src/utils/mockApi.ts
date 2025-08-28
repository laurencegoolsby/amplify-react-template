// Mock API utility functions for development
export const mockApiCall = async <T>(endpoint: string, delay: number = 1000): Promise<T> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  try {
    const response = await fetch(`/mocks/sample_responses/${endpoint}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch mock data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Mock API error:', error);
    throw error;
  }
};

// Specific mock API functions
export const processDocument = async (documentType: string, fileName: string) => {
  const endpoint = getEndpointByFileName(fileName);
  return mockApiCall(endpoint, 2000); // 2 second delay to simulate processing
};

const getEndpointByFileName = (fileName: string): string => {
  const name = fileName.toLowerCase();
  
  // Map specific filenames to their corresponding data files
  if (name.includes('paystub') && name.includes('high')) {
    return 'document-processing-result-high-confidence';
  }
  if (name.includes('paystub') && name.includes('low')) {
    return 'document-processing-result-low-confidence';
  }
  if (name.includes('drivers_license') && name.includes('high')) {
    return 'personal-info-result-high-confidence';
  }
  if (name.includes('drivers_license') && name.includes('low')) {
    return 'personal-info-result-low-confidence';
  }
  if (name.includes('utility_bill') && name.includes('high')) {
    return 'misc-document-result-high-confidence';
  }
  if (name.includes('utility_bill') && name.includes('low')) {
    return 'misc-document-result-low-confidence';
  }
  
  // Default fallback
  return 'document-processing-result-high-confidence';
};