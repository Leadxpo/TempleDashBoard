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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";

const columns = [
  { id: "donateNumber", label: "Donate Number", minWidth: 100 },
  { id: "userName", label: "Name", minWidth: 100 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 100 },
  { id: "Gothram", label: "Gothram", minWidth: 100 },
  { id: "userId", label: "User Id", minWidth: 100 },
  { id: "paymentRecept", label: "Payment Receipt", minWidth: 100 },
  { id: "amount", label: "Amount", minWidth: 100 },
  { id: "createdAt", label: "Date", minWidth: 100 },
];

const GodownStack = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("https://temple.signaturecutz.in/payments/api/get-all-payments");
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

  const handleOpenPdf = (fileName) => {
    const fullUrl = `https://temple.signaturecutz.in/storage/payment/${fileName}`;
    setSelectedPdf(fullUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPdf("");
  };

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
            <Searchbar />
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
                      style={{
                        top: 57,
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        padding: "2px 10px",
                        textAlign: "left",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          sx={{
                            padding: "8px 16px",
                            textAlign: "left",
                          }}
                        >
                          {column.id === "paymentRecept" ? (
                            row.paymentRecept ? (
                              <IconButton
                                onClick={() => handleOpenPdf(row.paymentRecept)}
                                title="View Receipt"
                              >
                                <PictureAsPdfIcon color="error" />
                              </IconButton>
                            ) : (
                              "-"
                            )
                          ) : (
                            row[column.id]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
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

      {/* PDF Preview Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Payment Receipt</DialogTitle>
        <DialogContent>
          {selectedPdf ? (
            <iframe
              src={selectedPdf}
              width="100%"
              height="600px"
              title="PDF Viewer"
              style={{ border: "none" }}
            ></iframe>
          ) : (
            "No PDF selected."
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GodownStack;
