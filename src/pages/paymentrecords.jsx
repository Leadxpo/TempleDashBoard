import React, { useEffect, useState } from "react";
import PageHeader from "../layout/PageHeader";
import Searchbar from "../layout/searchComponent";

import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Modal,
  Button,
  Typography,
} from "@mui/material";

import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import CloseIcon from "@mui/icons-material/Close";


import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";

const columns = [
  { id: "donateNumber", label: "Donate Number", minWidth: 100 },
  { id: "userName", label: "Name", minWidth: 100 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 100 },
  { id: "gothram", label: "Gothram", minWidth: 100 },
  { id: "userId", label: "User Id", minWidth: 100 },
  { id: "paymentRecept", label: "Payment Receipt", minWidth: 100 },
  { id: "amount", label: "Amount", minWidth: 100 },
  { id: "createdAt", label: "Date", minWidth: 100 },
];

const GodownStack = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("https://templeservice.signaturecutz.in/payments/api/get-all-payments");
        setRows(response.data.data);
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      }
    };

    fetchPayments();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "Payment_Records.xlsx");
  };

  const handleOpenPreviewModal = (row) => {
    setSelectedRow(row);
    setOpenPreviewModal(true);
  };

  const handleCloseModal = () => {
    setOpenPreviewModal(false);
    setSelectedRow(null);
  };


  const filteredRows = rows.filter((row) => {
    const donateMatch = row.donateNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatch = row.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    return donateMatch || nameMatch;
  });


  return (
    <>
      <PageHeader title="Payment Records" />
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
       <Searchbar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            <Box sx={{ display: "flex" }}>
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
  {filteredRows.length === 0 ? (
    <TableRow>
     <TableCell
           colSpan={columns.length}
           align="center"
           sx={{ fontSize: "1.2rem", fontWeight: "bold", py: 4 }}
         >
           No data available
         </TableCell>
    </TableRow>
  ) : (
    filteredRows
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, index) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              sx={{ padding: "8px 16px", textAlign: "center" }}
            >
              {column.id === "paymentRecept" ? (
                row.paymentRecept ? (
                  <TableCell key={column.id} sx={{ textAlign: "center" }}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenPreviewModal(row)}
                    >
                      View
                    </Button>
                  </TableCell>
                ) : (
                  "-"
                )
              ) : (
                row[column.id]
              )}
            </TableCell>
          ))}
        </TableRow>
      ))
  )}
</TableBody>

            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={rows.length}
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
                    src={`https://templeservice.signaturecutz.in/storege/payments/${selectedRow.paymentRecept}`}
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

export default GodownStack;
