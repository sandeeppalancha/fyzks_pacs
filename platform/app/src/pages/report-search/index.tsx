import { Card, Input, Tag } from "antd";
import React, { useState } from "react";
import { getUserDetails, makePostCall } from "../../utils/helper";

const ReportSearch = ({ openEditor }) => {
  const [searchResults, setSearchResults] = useState([]);

  const searchReports = (text) => {
    makePostCall('/search-reports', { keyword: text, user_id: getUserDetails()?.username })
      .then(res => {
        setSearchResults(res.data?.data || []);
      })
      .catch(err => {
        console.log("Error while searching reports: ", err);
        setSearchResults([])
      });
  }

  const handleKeydown = (e) => {
    const value = e.target.value;
    switch (e.key) {
      case 'Enter':
        searchReports(value);
        // TODO: Fetch search results based on the entered keywords
        break;
      default:
        break;
    }
  }
  return (
    <div>
      Search By Keywords:
      <Input placeholder="Enter keywords" style={{ width: 300 }} onKeyDown={handleKeydown} />
      <div className="results-div">
        {
          searchResults.map(itm => (
            <Card key={itm.id} onClick={() => openEditor({ pat_details: itm.ord_details, selected_report: itm })}>

              <div className="d-flex">
                <div>{itm.patientName}</div>
                <div>{itm.truncated}</div>
                <Tag className="ms-auto" color="green">{itm.ord_details?.po_pat_name} | {itm.ord_details?.po_diag_desc}</Tag>
              </div>
            </Card>
          ))
        }
      </div>
    </div>
  )
}

export default ReportSearch;
