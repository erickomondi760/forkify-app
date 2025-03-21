import { TIMEOUT_SECONDS } from "./config.JS";

export const getJson = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timer()]);
    if (!response.ok)
      throw new Error(`${data.message} : error code  ${response.status}`);
    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJson = async function (url, dataItem) {
  try {
    console.log(dataItem);
    const response = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataItem),
      }),
      timer(),
    ]);

    if (!response.ok)
      throw new Error(`${data.message} : error code  ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

const timer = function () {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error("The response took too long,kindly retry"));
    }, TIMEOUT_SECONDS * 1000);
  });
  console.log("Ooh my!");
};
