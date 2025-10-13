const server = "https://uniwa.evoxs.xyz"
async function reach(url, addServer, type, method = "GET", body = null, headers = {}) {
  try {
    const options = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };

    // Only attach body if it's a POST, PUT, PATCH, etc.
    if (["POST", "PUT", "PATCH", "DELETE"].includes(options.method) && body) {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await fetch(`${addServer ? server : ""}${url}`, options);

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.status);
    }

    const data = await response[!type ? "json" : type]();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
}

function getToken() {
    return localStorage.getItem("university")
}