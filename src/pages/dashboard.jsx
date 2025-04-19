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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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
          blockedDonate:
            "https://temple.signaturecutz.in/blockednumber/api/blocked-number-count",
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

  const fetchDonateData = async () => {
    try {
      const res = await axios.get(
        "https://temple.signaturecutz.in/payments/api/get-pending-payments"
      );
      const donateData = Array.isArray(res.data?.data) ? res.data.data : [];
      setData(donateData);
    } catch (err) {
      console.error("Error fetching donate data:", err);
      setData([]);
    }
  };

  const columns = [
    { id: "donateNumber", label: "Donate Number", minWidth: 100 },
    { id: "userName", label: "Name", minWidth: 100 },
    { id: "phoneNumber", label: "Phone Number", minWidth: 100 },
    // { id: "dob", label: "DOB", minWidth: 100 },
    { id: "paymentRecept", label: "Payment Recepts", minWidth: 80 },
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
      headStyles: { fillColor: [128, 128, 128], textColor: 255 },
      bodyStyles: { textColor: 0 },
      styles: { fontSize: 10, cellPadding: 2 },
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
    console.log("aaa", donateNumber,newStatus);
    try {
      await axios.put(
        `https://temple.signaturecutz.in/donate/api/update-donate-status/${donateNumber}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Status updated successfully");
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
      console.log("rrr", res.data);
      if (res.data.success) {
        handleStatusChange1(donateNumber, newStatus);
        alert("Payment status updated successfully");
      }
      console.log("Payment status updated successfully");
    } catch (error) {
      console.error(
        "Error updating payment status:",
        error.response?.data || error.message
      );
    }
  };

  const labelMap = {
    totalDonate: "Total Donate Numbers",
    blockedDonate: "Total Blocked Numbers",
    totalPayments: "Total Payments",
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
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  {labelMap[key]}
                </Typography>
                <Typography variant="h4">
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </Typography>
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
            <Searchbar />
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
                      style={{
                        top: 57,
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        padding: "2px 10px",
                        textAlign: "center", // ⬅️ center align header
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                      {columns.map((column) => {
                        const value = row[column.id];

                        if (column.id === "paymentRecept") {
                          return (
                            <TableCell
                              key={column.id}
                              sx={{ textAlign: "center" }}
                            >
                              <IconButton
                                onClick={() => handleOpenPreviewModal(row)}
                              >
                                <PictureAsPdfIcon sx={{ color: "red" }} />
                              </IconButton>
                            </TableCell>
                          );
                        }

                        if (column.id === "status") {
                          return (
                            <TableCell
                              key={column.id}
                              sx={{ textAlign: "center" }}
                            >
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
                          <TableCell
                            key={column.id}
                            sx={{ textAlign: "center" }}
                          >
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
            count={data.length}
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
