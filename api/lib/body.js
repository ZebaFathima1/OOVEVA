export const jsonBody = async (req) => {
  let body = '';

  for await (const chunk of req) {
    body += chunk;
  }

  try {
    return body ? JSON.parse(body) : {};
  } catch {
    return {};
  }
};
