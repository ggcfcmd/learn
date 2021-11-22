const domain = "http://localhost:8080";
export const get = async (requestUrl, params, headers) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(params);
    let queryString = "";
    keys.forEach((item, index) => {
      queryString += `${item}=${params[item]}`;
      queryString += index === keys.length - 1 ? "" : "&";
    });
    return new Promise((resolve, reject) => {
      url.request({
        url: `${domain}${requestUrl}?${queryString}`,
        headers,
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        },
      });
    });
  });
};
