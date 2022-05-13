const axios = require("axios");
const uuid = require("uuid").v4;

// Put your API credentials here
const cioTrackApiSite = "";
const cioTrackApiKey = "";
const cioAppApiKey = "";

const cioAppAxios = axios.create();
const cioTrackAxios = axios.create();

cioAppAxios.defaults.baseURL = "https://api-eu.customer.io/v1";
cioTrackAxios.defaults.baseURL = "https://track-eu.customer.io/api/v1";
cioAppAxios.defaults.headers["Authorization"] = `Bearer ${cioAppApiKey}`;
cioTrackAxios.defaults.auth = {
  username: cioTrackApiSite,
  password: cioTrackApiKey,
};

const customerId = uuid();

(async function () {
  // Create a segment
  const segment = await cioAppAxios
    .post("/segments", {
      segment: { name: "Foo", description: "Lorem ipsum..." },
    })
    .then((response) => {
      console.log(
        "Create segment \n",
        `    HTTP Code : ${response.status}\n`,
        `    Body : ${JSON.stringify(response.data)}\n\n`
      );
      return response.data.segment;
    });

  // Create a customer
  await cioTrackAxios
    .put(`/customers/${customerId}`, {
      email: "john@usejimo.com",
    })
    .then((response) =>
      console.log(
        "Create customer \n",
        `    HTTP Code : ${response.status}\n`,
        `    Body : ${JSON.stringify(response.data)}\n\n`
      )
    );

  // Add the customer to the segment
  await cioTrackAxios
    .post(
      `/segments/${segment.id}/add_customers`,
      {
        ids: [customerId],
      },
      { params: { id_type: "id" } }
    )
    .then((response) =>
      console.log(
        "Add customer to segment \n",
        `    HTTP Code : ${response.status}\n`,
        `    Body : ${JSON.stringify(response.data)}`
      )
    );
})();
