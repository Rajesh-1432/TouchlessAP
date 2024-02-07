import React, { useState, useEffect } from "react";
import { Table, Button, Modal,Checkbox } from "antd";
import Sidebar from "../components/Sidebar";
import { CloseOutlined } from "@ant-design/icons";

const Process = () => {
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfContent, setPdfContent] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [poNumber, setPoNumber] = useState("");

  const [myres, setMyres] = useState(
    JSON.parse(localStorage.getItem("apidata")) || []
  );

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const handleOnSubmit = () => {
      const selectedPoNumber = selectedRow.data[0].po_number;
      setPoNumber(selectedPoNumber);
      console.log("PO Number:", selectedPoNumber);

  };
  const handleOnClose = () => {
    // Handle submit logic here
    console.log("Close Icon clicked");
    setPdfVisible(false);
  };

  const handleOnCancel = () => {
    // Handle cancel logic here
    console.log("Cancel button clicked");
    // setPdfVisible(false);
  };

  const onDeleteClick = (record) => {
    const updatedData = myres.filter((_, index) => index !== record.sno - 1);
    setMyres(updatedData);
    localStorage.setItem("apidata", JSON.stringify(updatedData));
  };

  const onViewClick = (record) => {
    setSelectedRow(record);
    setPdfVisible(true);
  };

  useEffect(() => {
    // Simulate some background work
    // After the background work is done, disable the checkbox and check it automatically
    setTimeout(() => {
      setCheckboxDisabled(true);
    }, 2000); // Change the delay according to your needs
  }, []); // Empty dependency array ensures the effect runs only once

  // Filter out items with a key named "message"
  const filteredData = myres.filter((item) => !item.message);

  // Add serial numbers dynamically to the data
  const dataWithSerialNumbers = filteredData.map((item, index) => ({
    ...item,
    sno: index + 1,
  }));

  const columns = [
    { title: "Sno", dataIndex: "sno", key: "sno" },
    {
      title: "Email_Id",
      dataIndex: "senderEmail",
      key: "senderEmail",
    },
    {
      title: "No. of Attachments",
      dataIndex: "attachmentsCount",
      key: "attachmentsCount",
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      key: "attachment",
      render: (text, record) => (
        <div>
          {record.attachmentsCount > 0 ? (
            <Checkbox
              onChange={onChange}
              checked={checkboxDisabled}
              disabled={checkboxDisabled}
            />
          ) : (
            <span>No Attachment</span>
          )}
        </div>
      ),
    },
    {
      title: "GR Status",
      dataIndex: " ",
      key: " ",
    },
    {
      title: "GR No",
      dataIndex: " ",
      key: " ",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            style={{ backgroundColor: "#15f4ee" }}
            onClick={() => onViewClick(record)}
            disabled={record.attachmentsCount === 0} // Disable if no attachments
          >
            View
          </Button>
          <Button
            type="danger"
            style={{ color: "#fd5c63" }}
            onClick={() => onDeleteClick(record)}
          >
            <b>Delete</b>
          </Button>
        </>
      ),
    },
  ];

  const modalFooter = (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <Button key="submit" type="primary" onClick={handleOnSubmit}>
        Submit
      </Button>
      <Button
        key="cancel"
        onClick={handleOnCancel}
        style={{ marginLeft: "10px", color: "red" }}
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ width: "100%", padding: "10px" }}>
        <Table
          columns={columns}
          dataSource={dataWithSerialNumbers}
          pagination={{ pageSize: 8 }}
          style={{}}
        />
        <Modal
          title="Details Page"
          width={"70%"}
          style={{ position: "sticky" }}
          footer={modalFooter}
          visible={pdfVisible}
          onCancel={handleOnClose}
          closeIcon={
            <CloseOutlined style={{ fontSize: "20px", color: "#999" }} />
          }
        >
          {pdfVisible && (
            <div style={{ display: "flex" }}>
              {selectedRow.data.map((item, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  {Object.entries(item).map(
                    ([label, value], idx) =>
                      // Exclude rendering if label is "pdfBuffer" or "message"
                      !["pdfBuffer", "message"].includes(label) && (
                        <div key={idx} style={{ marginBottom: "10px" }}>
                          <label
                            style={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            {label}
                          </label>
                          <input
                            type="text"
                            value={value || ""}
                            readOnly
                            style={{
                              fontSize: "14px",
                              padding: "5px",
                              width: "100%",
                            }}
                          />
                        </div>
                      )
                  )}
                </div>
              ))}
              <div style={{ padding: "30px", width: "50%" }}>
                <iframe
                  title="PDF Viewer"
                  src={`data:application/pdf;base64,${selectedRow.data[0].pdfBuffer}`}
                  width="700px"
                  height="450px"
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Process;