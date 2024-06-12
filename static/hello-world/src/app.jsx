import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { requestJira } from "@forge/bridge";

function App() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState(null);

  async function getSomeFilters() {
    const maxResults = 100;
    const startAt = 0;
    let response;
    try {
      response = await requestJira(
        `/rest/api/3/filter/search?maxResults=${maxResults}&startAt=${startAt}`
      );
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
    if (response.ok) {
      const result = await response.json();
      console.log("Loaded filters #", result.total);
      return result;
    } else {
      console.error("Failed to fetch filters:", response);
      return null;
    }
  }

  useEffect(() => {
    getSomeFilters()
      .then((filters) => setFilters(filters))
      .catch(console.error);
  }, []);

  useEffect(() => {
    invoke("getText", { example: "my-invoke-variable" })
      .then(setData)
      .catch((error) => console.error("Failed to fetch data:", error));
  }, []);

  return (
    <div>
      <div>{data ? data : "Loading text..."}</div>
      <div>{filters ? `${filters.total} filters found` : "Loading filters..."}</div>
    </div>
  );
}

export default App;
