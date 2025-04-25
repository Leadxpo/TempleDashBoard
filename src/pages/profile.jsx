import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../layout/PageHeader";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const inputStyles = { color: "black" };
  const textFieldProps = {
    InputProps: { style: inputStyles },
    InputLabelProps: { style: inputStyles },
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "black" },
        "&:hover fieldset": { borderColor: "black" },
        "&.Mui-focused fieldset": { borderColor: "black" },
      },
      input: { color: "black" },
      label: { color: "black" },
    },
  };

  const handleOpenPasswordModal = () => setOpenPasswordModal(true);
  const handleClosePasswordModal = () => setOpenPasswordModal(false);

  const handleFileChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append all user fields
      for (const key in user) {
        if (user[key]) formData.append(key, user[key]);
      }

      // Append file if selected
      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      }

      const response = await axios.put(
        "http://localhost:3001/systemuser/api/user-update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/systemuser/api/reset-password",
        {
          userId: user.userId,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully");
      handleClosePasswordModal();
    } catch (error) {
      console.error("Password change error:", error);
      alert("Failed to change password. Check old password.");
    }
  };

  const handleInputChange = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  return (
    <>
      <PageHeader title="User Details" />
      <Card
        sx={{
          maxWidth: 1500,
          margin: "40px auto",
          padding: 2,
          backgroundColor: "white",
          color: "black",
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom align="center" sx={{ color: "black" }}>
            My Profile
          </Typography>
          <Divider sx={{ mb: 5, backgroundColor: "white" }} />

          {user ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} display="flex" alignItems="center">
                <Avatar
                  src={
                    user?.profilePic
                      ? `http://localhost:3001/storege/userdp/${user.profilePic}`
                      : ""
                  }
                  sx={{ width: 100, height: 100 }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <IconButton
                  sx={{ marginLeft: 2, color: "black" }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <Edit />
                </IconButton>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Name"
                  value={user.userName}
                  onChange={(e) => handleInputChange("userName", e.target.value)}
                  {...textFieldProps}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="User ID"
                  value={user.userId}
                  onChange={(e) => handleInputChange("userId", e.target.value)}
                  {...textFieldProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  {...textFieldProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={user.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  {...textFieldProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="DOB"
                  value={user.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  {...textFieldProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aadhar Number"
                  value={user.aadharNumber}
                  onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                  {...textFieldProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={user.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  {...textFieldProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  value={user.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  {...textFieldProps}
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button variant="outlined" sx={{ mr: 2, color: "black", borderColor: "black" }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{ mr: 2, backgroundColor: "black", color: "white" }}
                  onClick={handleUpdateProfile}
                >
                  Update User
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ color: "white" }}
                  onClick={handleOpenPasswordModal}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Typography align="center" sx={{ color: "black" }}>
              Loading...
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Password Modal */}
      <Dialog open={openPasswordModal} onClose={handleClosePasswordModal}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            margin="dense"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="dense"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordModal}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
