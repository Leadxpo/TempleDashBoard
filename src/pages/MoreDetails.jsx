import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PageHeader from "../layout/PageHeader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
const location=useLocation();
const userId=location.state.userDetails.sno
console.log("++++",location.state.userDetails.sno
);
  const inputStyles = {
    color: "black",
  };

  const textFieldProps = {
    InputProps: { style: inputStyles },
    InputLabelProps: { style: inputStyles },
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "black",
        },
        "&:hover fieldset": {
          borderColor: "black",
        },
        "&.Mui-focused fieldset": {
          borderColor: "black",
        },
      },
      input: { color: "black" },
      label: { color: "black" },
    },
  };

  const fetchUserDetails = async () => {
    console.log("response user",userId )
    try {
      const response = await axios.post(
        "https://temple.signaturecutz.in/user/api/get-user",
        {id: userId },
        {
          headers: {
            "Content-Type": "application/json",

            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("response user",response )

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        console.error("Failed to fetch detailed user data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  return (
    <>
      <PageHeader title="User Details" />
      <Card
        sx={{
          maxWidth: 1200,
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
          <Divider sx={{ mb: 5, backgroundColor: "black" }} />

          {user ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} display="flex" alignItems="center">
                <Avatar
                  src={
                    user?.profilePic
                      ? `https://temple.signaturecutz.in/storage/userdp/${user.profilePic}`
                      : ""
                  }
                  sx={{ width: 100, height: 100 }}
                />
                <IconButton sx={{ marginLeft: 2, color: "black" }}>
                  <Edit />
                </IconButton>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Name" defaultValue={user.userName} {...textFieldProps} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="User ID" defaultValue={user.userId} {...textFieldProps} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" defaultValue={user.email} {...textFieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" defaultValue={user.phoneNumber} {...textFieldProps} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="DOB" defaultValue={user.dob} {...textFieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Aadhar Number" defaultValue={user.aadharNumber} {...textFieldProps} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Gender" defaultValue={user.gender || "N/A"} {...textFieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Marriage Status" defaultValue={user.marriage_status || "N/A"} {...textFieldProps} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Address" defaultValue={user.address || "Not Provided"} {...textFieldProps} />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button variant="outlined" sx={{ mr: 2, color: "black", borderColor: "black" }} onClick={() => navigate(-1)}>
                  Back
                </Button>
                {/* <Button variant="contained" sx={{ mr: 2, backgroundColor: "black", color: "white" }}>
                  Save
                </Button> */}
              </Grid>
            </Grid>
          ) : (
            <Typography align="center" sx={{ color: "black" }}>
              Loading...
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Profile;
