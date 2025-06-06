import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Menu,
  MenuItem,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const columns = [
  { id: "sno", label: "S.No", minWidth: 50 },
  { id: "userName", label: "Name", minWidth: 200 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 100 },
  { id: "aadharNumber", label: "Aadhar Number", minWidth: 100 },
  { id: "donateNumber", label: "Donate Number", minWidth: 150 },
  { id: "userId", label: "User Id", minWidth: 100 },
  { id: "gender", label: "Gender", minWidth: 100 },
  { id: "action", label: "Action", minWidth: 100 },
];

function GodownStack() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://templeservice.signaturecutz.in/user/all-user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const userData = response.data?.data || [];

      const formattedRows = userData.map((user, index) => ({
        id: user.id, // 🔑 Needed for delete
        sno: index + 1,
        userName: user.userName || "N/A",
        phoneNumber: user.phoneNumber || "N/A",
        aadharNumber: user.aadharNumber || "N/A",
        donateNumber: user.donateNumber || "N/A",
        userId: user.userId || "N/A",
        address: user.address || "N/A",
        gender: user.gender || "N/A",
        marriage_status: user.marriage_status || "N/A",
        profilePic: user.profilePic || "N/A",
        gothram: user.gothram || "N/A",
        email: user.email || "N/A",
        dob: user.dob || "N/A",

        action: "Action",
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleMoreDetails = (details) => {
    handleMenuClose();
    navigate("/moredetails", { state: { userDetails: details } });
  };

  const handleDelete = async () => {
    if (!menuRow?.id) {
      console.error("No user ID found for deletion");
      return;
    }

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      await axios.delete(`https://templeservice.signaturecutz.in/user/delete-user/${menuRow.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      handleMenuClose();
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.text("User List", 14, 16);
    doc.autoTable({
      head: [columns.map((col) => col.label)],
      body: rows.map((row) => columns.map((col) => row[col.id] || "")),
      startY: 20,
      headStyles: { fillColor: [128, 128, 128], textColor: 255 },
      bodyStyles: { textColor: 0 },
      styles: { fontSize: 10, cellPadding: 2 },
    });
    doc.save("User_List.pdf");
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User List");
    XLSX.writeFile(workbook, "User_List.xlsx");
  };

  const filteredRows = rows.filter((row) =>
    row.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.aadharNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  


  return (
    <>
      <PageHeader title="User List" />
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
                  <Searchbar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

            <Box sx={{ display: "flex" }}>
              <IconButton title="Download Excel"  color="primary" onClick={handleDownloadExcel}>
                <SimCardDownloadIcon />
              </IconButton>
              <IconButton 
  title="Download PDF" 
  onClick={handleDownloadPDF}
  sx={{ color: 'red' }}
>
  <PictureAsPdfIcon />
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
                         align="left"
                      sx={{
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
  {rows.length === 0 ? (
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
  
      .map((row) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.sno}>
          {columns.map((column) => {
            const value = row[column.id];
            return column.id === "action" ? (
              <TableCell key={column.id} sx={{ textAlign: "center" }}>
                <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && menuRow?.sno === row.sno}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  <MenuItem onClick={() => handleMoreDetails(row)}>
                    More Details
                  </MenuItem>
                </Menu>
              </TableCell>
            ) : (
              <TableCell
                key={column.id}
                sx={{ padding: "8px 16px", textAlign: "left" }}
              >
                {value}
              </TableCell>
            );
          })}
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
    </>
  );
}

export default GodownStack;
