import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { requestJira } from "@forge/bridge";

function App() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState(null);

  async function getAllFilters() {
    const maxResults = 100;
    let startAt = 0;
    let totalResult = await getSomeFilters(maxResults, startAt);
    if (!totalResult.isLast) {
      startAt = totalResult.startAt + maxResults;
      while (true) {
        const result = await getSomeFilters(maxResults, startAt);
        totalResult.values.push(...result.values);
        startAt = result.startAt + maxResults;
        if (result.isLast) {
          break;
        }
      }
      console.log(
        `+++ getAllFilters found ${totalResult.values.length} filters`
      );
      return totalResult;
    }
    return totalResult;
  }

  async function getSomeFilters(maxResults, startAt) {
    let response;
    try {
      response = await requestJira(
        `/rest/api/3/filter/search?maxResults=${maxResults}&startAt=${startAt}`
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch filters - startAt: ${startAt}, maxResults: ${maxResults}`
      );
    }
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error(
        `Failed to fetch filters - startAt: ${startAt}, maxResults: ${maxResults}`
      );
    }
  }

  useEffect(() => {
    getAllFilters()
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
      <div>
        {filters ? `${filters.total} filters found` : "Loading filters..."}
      </div>
    </div>
  );
}

export default App;
