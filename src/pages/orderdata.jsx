import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const columns = [
  { id: "donateNumber", label: "Donate Number", minWidth: 100 },
  { id: "userName", label: "Name", minWidth: 100 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 100 },
  { id: "dob", label: "DOB", minWidth: 100 },
  { id: "gothram", label: "Gothram", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 100 },
];

function GodownStack() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/donate/api/get-all-donate-numbers")
      .then((res) => {
        const fetchedData = Array.isArray(res.data.data) ? res.data.data : [];
        setData(fetchedData);
      })
      .catch((err) => {
        console.error("Error fetching donate data:", err);
        setData([]);
      });
  }, []);

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
      body: data.map((row) =>
        columns.map((col) => row[col.id] ?? "")
      ),
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



  const filteredRows = data.filter((row) => {
    const donateMatch = row.donateNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatch = row.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    return donateMatch || nameMatch;
  });

  return (
    <>
      <PageHeader title="Donate Numbers" />
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
            <IconButton 
  title="Download PDF" 
  onClick={handleDownloadPDF}
  sx={{ color: 'red' }}
>
  <PictureAsPdfIcon />
</IconButton>

              <IconButton title="Download Excel"  color="primary" onClick={handleDownloadExcel}>
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
                      sx={{
                         textAlign: "left" ,
                        fontWeight: "bold",
                        backgroundColor: "#f0f0f0", // Light gray
                        color: "#000",
                        padding: "8px 16px", // Increase padding
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
    .map((row, idx) => (
      <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            sx={{ padding: "8px 16px", textAlign: "left" }}
          >
            {row[column.id] ?? ""}
          </TableCell>
        ))}
      </TableRow>
    ))
)}

              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
}

export default GodownStack;
