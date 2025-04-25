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
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../layout/PageHeader";


const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state?.userDetails;

  console.log("++++++++++++++++++++++++>",userDetails)

  useEffect(() => {
    if (userDetails) {
      setUser(userDetails); // Directly set the user data from location.state
    }
  }, [userDetails]);
  console.log("++++++++++++++++srinu++++++++>",user)

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
            User Details
          </Typography>
          <Divider sx={{ mb: 5, backgroundColor: "black" }} />

          {user ? (
  <Grid container spacing={3}>
    {/* Top Section: Avatar + Name */}
    <Grid item xs={12}>
      <Grid container spacing={2} justifyContent="space-around">
        <Grid item>
          <Avatar
            src={
              user?.profilePic
                ? `https://temple.signaturecutz.in/storege/userdp/${user.profilePic}`
                : ""
            }
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Full Name"
            variant="outlined"
            margin="normal"
            fullWidth
            defaultValue={user.userName}
            disabled
            {...textFieldProps}
          />
        </Grid>
        <Grid item>
          <IconButton sx={{ color: "black" }}>
            {/* <Edit /> */}
          </IconButton>
        </Grid>
      </Grid>
    </Grid>

    {/* Bottom Section: Other Fields in 2 Columns */}
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.phoneNumber}
            disabled
            {...textFieldProps}
          />
          <TextField
            label="Aadhar Number"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.aadharNumber}
            disabled
            {...textFieldProps}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.address}
            disabled
            {...textFieldProps}
          />
          <TextField
            label="Donate Number"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.donateNumber}
            disabled
            {...textFieldProps}
          />
          <TextField
            label="User Id"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.userId}
            disabled
            {...textFieldProps}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.email}
            disabled
            {...textFieldProps}
          />
          <TextField
            label="Gender"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.gender}
            disabled
            {...textFieldProps}
          />
          <TextField
            label="DOB"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.dob}
            disabled
            {...textFieldProps}
          />
          <TextField
            label="Gothram"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.gothram}
            disabled
            {...textFieldProps}
          />
          <TextField
            label="Marriage Status"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={user.marriage_status}
            disabled
            {...textFieldProps}
          />
        </Grid>
      </Grid>
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
