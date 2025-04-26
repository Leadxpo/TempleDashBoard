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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Columns configuration

function GodownStack() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openSingleModal, setOpenSingleModal] = useState(false);
  const [openMultiModal, setOpenMultiModal] = useState(false);
  const [singleNumber, setSingleNumber] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [toNumber, setToNumber] = useState("");

  // For single number modal
  const [singleDescription, setSingleDescription] = useState("");
  const [singleStatus, setSingleStatus] = useState("active");

  // For multiple number modal
  const [multiDescription, setMultiDescription] = useState("");
  const [multiStatus, setMultiStatus] = useState("active");
  const [assignTo, setAssignTo] = useState("");
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    donateNumber: "",
    userId: "",
    userName: "",
    phoneNumber: "",
    dob: "",
    gothram: "",
    status: "Admin Assign",
    description: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAssignClick = (row) => {
    setSelectedRow(row);
    setFormData((prev) => ({
      ...prev,
      donateNumber: row.blockedNumber || "",
    }));
    setOpenAssignModal(true);
  };

  // const handleAssignSubmit = () => {
  //   alert(`Assigned ${selectedRow?.blockedNumber} to ${assignTo}`);
  //   setOpenAssignModal(false);
  //   setAssignTo("");
  // };

  const columns = [
    { id: "blockedNumber", label: "Blocked Number", minWidth: 100 },
    { id: "description", label: "Description", minWidth: 200 },
    { id: "status", label: "Status", minWidth: 100 },
    {
      id: "assign",
      label: "Assign",
      render: (row) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleAssignClick(row)}
        >
          Assign
        </Button>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <IconButton onClick={() => handleDelete(row)}>
          <DeleteIcon sx={{ color: "red" }} />
        </IconButton>
      ),
    },
  ];

  const fetchBlockedData = () => {
    axios
      .get("http://localhost:3001/blockednumber/api/get-all-blocked-numbers")
      .then((res) => {
        const blocked = res.data.data?.filter((item) => item.isBlocked) || [];
        setData(blocked);
      })
      .catch((err) => {
        console.error("Error fetching donate data:", err);
      });
  };

  useEffect(() => {
    fetchBlockedData();
  }, []);

  const handleSaveSingle = async () => {
    if (!singleNumber) {
      return alert("Enter a valid number.");
    }

    try {
      await axios.post("http://localhost:3001/blockednumber/api/block-single", {
        blockedNumber: singleNumber.toString(),
        description: singleDescription,
        status: singleStatus,
      });
      alert("Number blocked successfully!");
      setSingleNumber("");
      setSingleDescription("");
      setSingleStatus("active");
      setOpenSingleModal(false);
      fetchBlockedData();
    } catch (err) {
      console.error("Error blocking single number:", err);
      alert("This number already exists in the donated list");
    }
  };

  const handleSaveMultiple = async () => {
    const from = parseInt(fromNumber, 10);
    const to = parseInt(toNumber, 10);
    if (isNaN(from) || isNaN(to) || from > to) {
      return alert("Enter a valid range.");
    }

    try {
      await axios.post("http://localhost:3001/blockednumber/api/block-range", {
        from,
        to,
        description: multiDescription,
        status: multiStatus,
      });

      alert(`Numbers from ${from} to ${to} blocked successfully!`);
      setFromNumber("");
      setToNumber("");
      setMultiDescription("");
      setMultiStatus("active");
      setOpenMultiModal(false);
      fetchBlockedData();
    } catch (err) {
      console.error("Error blocking multiple numbers:", err);
      alert("Failed to block multiple numbers.");
    }
  };

  const handleUserIdChange = async (e) => {
    const userId = e.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, userId })); // set userId first

    if (userId.length >= 3) {
      try {
        const response = await axios.post(
          `http://localhost:3001/user/get-by-userId`,
          { userId }
        );
        const user = response.data.data;

        if (user?.donateNumber) {
          alert("This user already has a donate number.");
        }

        // 🛠️ Update formData with the user details you got:
        setFormData((prevFormData) => ({
          ...prevFormData,
          userId: user.userId || prevFormData.userId,
          userName: user.userName || "", // assuming API returns these fields
          phoneNumber: user.phoneNumber || "",
          dob: user.dob || "",
          relation: user.relation || "",
          gothram: user.gothram || "",
        }));

        setUserDetails(user); // optional: if you want to show on card
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails(null);
      }
    } else {
      setUserDetails(null);
    }
  };

  const handleAssignSubmit = async () => {
    if (
      !formData.userId ||
      !formData.userName ||
      !formData.phoneNumber ||
      !formData.dob
    ) {
      return alert("Please fill in all required fields.");
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/donate/api/create-donate-number",
        formData
      );

      if (response.data.success) {
        // ✅ If donate number creation is successful

        // 👇 Call handleUserUpdate and pass userId and donateNumber
        await handleUserUpdate({
          userId: formData.userId,
          donateNumber: formData.donateNumber,
        });

        alert(`Successfully assigned donate number ${formData.donateNumber}`);
        setOpenAssignModal(false);
      } else {
        alert("Failed to assign donate number.");
      }
    } catch (err) {
      console.error("Error assigning donate number:", err);
      alert("Failed to assign donate number.");
    }
  };

  const handleUserUpdate = async (updateFormData) => {
    console.log("rrr :", updateFormData);
    try {
      const updateResponse = await axios.put(
        "http://localhost:3001/user/user-update-donateNumber",
        {
          userId: updateFormData.userId,
          donateNumber: updateFormData.donateNumber,
        }
      );

      if (updateResponse.data.success) {
        console.log("User updated successfully:", updateResponse.data);
        await handleDeleteBlockNumber({
          donateNumber: formData.donateNumber,
        });
      } else {
        console.error("User update failed:", updateResponse.data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return false; // ❌ Error
    }
  };

  const handleDelete = async (row) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${row.blockedNumber}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:3001/blockednumber/api/delete-blocked-number/${row.blockedNumber}`
      );
      alert(res.data.message);
      fetchBlockedData(); // Refresh the list
    } catch (err) {
      console.error("Error deleting blocked number:", err);
      alert("Failed to delete blocked number");
    }
  };
  const handleDeleteBlockNumber = async (row) => {
console.log("rrr :",row)
    try {
      const res = await axios.delete(
        `http://localhost:3001/blockednumber/api/delete-blocked-number/${row.donateNumber}`
      );
      alert(res.data.message);
      fetchBlockedData(); // Refresh the list
    } catch (err) {
      console.error("Error deleting blocked number:", err);
      alert("Failed to delete blocked number");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.text("Blocked Donate Numbers", 14, 16);
    doc.autoTable({
      head: [columns.map((col) => col.label)],
      body: filteredData.map((row) => columns.map((col) => row[col.id] || "")),
      startY: 20,
    });
    doc.save("Blocked_Donate_List.pdf");
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Blocked Donate List");
    XLSX.writeFile(workbook, "Blocked_Donate_List.xlsx");
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.blockedNumber?.toString().toLowerCase().includes(search) ||
      item.blockedNumber?.toLowerCase().includes(search) ||
      item.blockedNumber?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <PageHeader title="Blocked Numbers" />
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
              flexWrap: "wrap",
            }}
          >
            <Searchbar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => setOpenSingleModal(true)}
              >
                Block Single Number
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenMultiModal(true)}
              >
                Block Multiple Numbers
              </Button>
              <IconButton
                title="Download PDF"
                onClick={handleDownloadPDF}
                sx={{ color: "red" }}
              >
                <PictureAsPdfIcon />
              </IconButton>

              <IconButton
                title="Download Excel"
                color="primary"
                onClick={handleDownloadExcel}
              >
                <SimCardDownloadIcon />
              </IconButton>
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
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
                {filteredData.length === 0 ? (
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
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, idx) => (
                      <TableRow hover key={idx}>
                        {columns.map((column) => (
                          <TableCell key={column.id} align="center">
                            {column.render
                              ? column.render(row)
                              : row[column.id] ?? ""}
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

      <Dialog open={openSingleModal} onClose={() => setOpenSingleModal(false)}>
        <DialogTitle>Block Single Number</DialogTitle>
        <DialogContent>
          <TextField
            label="Donate Number"
            type="number"
            fullWidth
            value={singleNumber}
            onChange={(e) => setSingleNumber(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={singleDescription}
            onChange={(e) => setSingleDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Status"
            select
            fullWidth
            value={singleStatus}
            onChange={(e) => setSingleStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSingleModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSingle}>
            Block
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMultiModal} onClose={() => setOpenMultiModal(false)}>
        <DialogTitle>Block Multiple Numbers</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="From"
              type="number"
              value={fromNumber}
              onChange={(e) => setFromNumber(e.target.value)}
            />
            <TextField
              label="To"
              type="number"
              value={toNumber}
              onChange={(e) => setToNumber(e.target.value)}
            />
          </Box>
          <TextField
            label="Description"
            fullWidth
            value={multiDescription}
            onChange={(e) => setMultiDescription(e.target.value)}
          />
          <TextField
            label="Status"
            select
            fullWidth
            value={multiStatus}
            onChange={(e) => setMultiStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMultiModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveMultiple}>
            Bolck
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)}>
  <DialogTitle>Assign Blocked Number</DialogTitle>
  <DialogContent>
    {/* Blocked Number Field */}
    <TextField
      label="Blocked Number"
      fullWidth
      value={formData.donateNumber}
      InputProps={{ readOnly: true }}
      sx={{ mt: 2 }}
    />

    {/* User ID Input */}
    <TextField
      label="User ID"
      fullWidth
      value={formData.userId}
      onChange={handleUserIdChange}
      sx={{ mt: 2 }}
    />

    {/* User Details Card */}
    {userDetails && (
      <Card sx={{  p: 2  }}>
        <CardContent>
          <Typography sx={{ mb: 2,  }}><strong>User Details:</strong></Typography>
          <Typography><strong>Name:</strong> {userDetails.userName}</Typography>
          <Typography><strong>Phone number:</strong> {userDetails.phoneNumber}</Typography>
          <Typography><strong>DOB:</strong> {userDetails.dob}</Typography>
          <Typography><strong>Aadhar Number:</strong> {userDetails.aadharNumber}</Typography>
          <Typography><strong>Donate Number:</strong> {userDetails.donateNumber}</Typography>
          <Typography><strong>Gothram:</strong> {userDetails.gothram}</Typography>
          <Typography><strong>Gender:</strong> {userDetails.gender}</Typography>
          <Typography><strong>Address:</strong> {userDetails.address}</Typography>
          <Typography><strong>Marriage Status:</strong> {userDetails.marriage_status}</Typography>
        </CardContent>
      </Card>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenAssignModal(false)}>Cancel</Button>

    {/* Assign button, disable if user already has a donateNumber */}
    <Button
      onClick={handleAssignSubmit}
      variant="contained"
      color="primary"
      disabled={userDetails?.donateNumber} // ✅ DISABLE if donateNumber exists
    >
      Assign
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
}

export default GodownStack;
