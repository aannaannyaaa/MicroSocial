export const ok = (data: any, message = "OK") => ({
    success: true,
    message,
    data
  });
  
  export const fail = (statusCode: number, message: string) => ({
    success: false,
    statusCode,
    message
  });
  