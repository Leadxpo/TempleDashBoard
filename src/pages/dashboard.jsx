// your existing imports remain unchanged
import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../layout/PageHeader";
import Searchbar from "../layout/searchComponent";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Modal,
  Button,
  TextField,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
// Removed PDF icon usage
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const DashboardPage = () => {
  const [counts, setCounts] = useState({
    totalDonate: 0,
    blockedDonate: 0,
    totalPayments: 0,
  });

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [searchText, setSearchText] = useState("");

  const token = localStorage.getItem("accessToken");

  const handleOpenPreviewModal = (row) => {
    setSelectedRow(row);
    setOpenPreviewModal(true);
  };

  const handleCloseModal = () => {
    setOpenPreviewModal(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const endpoints = {
          totalDonate: "https://temple.signaturecutz.in/donate/api/count-pending-donates",
          blockedDonate: "https://temple.signaturecutz.in/blockednumber/api/blocked-number-count",
          totalPayments: "https://temple.signaturecutz.in/payments/api/total-payments",
        };

        const requests = Object.entries(endpoints).map(([key, url]) =>
          axios.get(url).then((response) => ({
            key,
            count:
              typeof response.data.data === "object"
                ? response.data.data?.count ?? 0
                : response.data.data ?? 0,
          }))
        );

        const results = await Promise.all(requests);
        const updatedCounts = results.reduce((acc, { key, count }) => {
          acc[key] = count || 0;
          return acc;
        }, {});

        setCounts((prevCounts) => ({
          ...prevCounts,
          ...updatedCounts,
        }));
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [token]);

  useEffect(() => {
    fetchDonateData();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.donateNumber?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, data]);

  const fetchDonateData = async () => {
    try {
      const res = await axios.get(
        "https://temple.signaturecutz.in/payments/api/get-pending-payments"
      );
      const donateData = Array.isArray(res.data?.data) ? res.data.data : [];
      setData(donateData);
      setFilteredData(donateData);
    } catch (err) {
      console.error("Error fetching donate data:", err);
      setData([]);
    }
  };

  const columns = [
    { id: "donateNumber", label: "Donate Number", minWidth: 100 },
    { id: "userName", label: "Name", minWidth: 100 },
    { id: "phoneNumber", label: "Phone Number", minWidth: 100 },
    { id: "paymentRecept", label: "Payment Receipts", minWidth: 80 },
    { id: "status", label: "Status", minWidth: 100 },
  ];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.text("Donate Number List", 14, 16);
    doc.autoTable({
      head: [columns.map((col) => col.label)],
      body: data.map((row) => columns.map((col) => row[col.id] || "")),
      startY: 20,
    });
    doc.save("Donate_List.pdf");
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donate List");
    XLSX.writeFile(workbook, "Donate_List.xlsx");
  };

  const handleStatusChange1 = async (donateNumber, newStatus) => {
    try {
      await axios.put(
        `https://temple.signaturecutz.in/donate/api/update-donate-status/${donateNumber}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusChange = async (idx, donateNumber, newStatus) => {
    const updatedData = [...data];
    updatedData[idx].status = newStatus;
    setData(updatedData);

    try {
      const res = await axios.put(
        `https://temple.signaturecutz.in/payments/api/update-payment-status/${donateNumber}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        handleStatusChange1(donateNumber, newStatus);
        alert("Payment status updated successfully");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const labelMap = {
    totalDonate: "Total Donate Numbers",
    blockedDonate: "Total Blocked Numbers",
    totalPayments: "Total Payments",
  };

  const cardColors = {
    totalDonate: "#00e6e6",
    blockedDonate: "#ff6666",
    totalPayments: "#4dff4d",
  };

  return (
    <>
      <PageHeader title="Dashboard Overview" />

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#fff",
          minHeight: "30vh",
          mt: 2,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={3}>
          {Object.entries(counts).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Paper sx={{ p: 3, textAlign: "center", backgroundColor: cardColors[key] }}>
                <Typography variant="h6" gutterBottom>
                  {labelMap[key]}
                </Typography>
                <Typography variant="h4">{value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Paper sx={{ width: "100%", mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              padding: 3,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          >
            <TextField
              label="Search by Name or Donate Number"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              sx={{ minWidth: "300px" }}
            />
            <Box sx={{ display: "flex" }}>
              <IconButton title="Download PDF" onClick={handleDownloadPDF}>
                <CloudUploadIcon />
              </IconButton>
              <IconButton title="Download Excel" onClick={handleDownloadExcel}>
                <SimCardDownloadIcon />
              </IconButton>
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: 840 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                         align="center"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f0f0f0", // Light gray
                        color: "#000",
                        padding: "16px 8px", // Increase padding
                        height: "60px", // Optional: fixed height for each header cell
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => (
                    <TableRow hover tabIndex={-1} key={idx}>
                      {columns.map((column) => {
                        const value = row[column.id];

                        if (column.id === "paymentRecept") {
                          return (
                            <TableCell key={column.id} sx={{ textAlign: "center" }}>
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => handleOpenPreviewModal(row)}
                              >
                                View
                              </Button>
                            </TableCell>
                          );
                        }

                        if (column.id === "status") {
                          return (
                            <TableCell key={column.id} sx={{ textAlign: "center" }}>
                              <select
                                value={value || "Pending"}
                                onChange={(e) =>
                                  handleStatusChange(
                                    idx,
                                    row.donateNumber,
                                    e.target.value
                                  )
                                }
                                style={{
                                  padding: "4px 8px",
                                  fontWeight: 600,
                                  color:
                                    value === "Approved"
                                      ? "green"
                                      : value === "Declined"
                                      ? "red"
                                      : "orange",
                                  borderRadius: "4px",
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Declined">Declined</option>
                              </select>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={column.id} sx={{ textAlign: "center" }}>
                            {value || ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>


 {/* Row Preview Modal */}
        <Modal open={openPreviewModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Donation Detail</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selectedRow && (
            <Box>
              {/* Show paymentRecept image first if available */}
              {selectedRow.paymentRecept && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Payment Receipt:
                  </Typography>
                  <img
                    src={`https://temple.signaturecutz.in/storege/payments/${selectedRow.paymentRecept}`}
                    alt="Payment Receipt"
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "contain",
                      marginTop: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>
              )}

              {/* Loop through other fields except unwanted ones */}
              {Object.entries(selectedRow).map(([key, value]) => {
                if (
                  key === "paymentRecept" ||
                  key === "createdAt" ||
                  key === "updatedAt" ||
                  key === "donateId"
                ) {
                  return null; // Skip these keys
                }

                return (
                  <Box key={key} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {key}:
                    </Typography>
                    <Typography variant="body2">{value || "N/A"}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Modal>






    </>
  );
};

export default DashboardPage;
