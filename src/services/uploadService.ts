export const uploadFile = async (
  file: File, 
  documentType: string,
  onProgress: (progress: number | ((prev: number) => number)) => void
): Promise<any> => {
  const endpoint = 'http://copa-a-appli-xy2jnn96xnau-1399784121.us-west-2.elb.amazonaws.com/upload';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('fileSize', file.size.toString());
  formData.append('documentType', documentType);
  formData.append('contentType', file.type);
  formData.append('timestamp', new Date().toISOString());
  
  // Simulate progress
  const progressInterval = setInterval(() => {
    onProgress((prev: number) => {
      if (prev >= 90) {
        clearInterval(progressInterval);
        return prev;
      }
      return prev + Math.random() * 15;
    });
  }, 100);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
    
    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    clearInterval(progressInterval);
    onProgress(100);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearInterval(progressInterval);
    onProgress(100);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    throw error;
  }
};