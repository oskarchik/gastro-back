export const getRoute = (baseUrl: string | undefined) => {
  if (baseUrl) {
    return baseUrl.split('/').pop() as string;
  }
  return '';
};
