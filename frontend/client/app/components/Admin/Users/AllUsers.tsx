import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Modal,
  Typography,
} from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";

import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "../../../../redux/features/user/userApi";
import { style } from "@/app/styles/style";
import toast from "react-hot-toast";

type Props = { isTeam: boolean };

const AllCourses: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(false); // Toggle for the add/edit form
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [openDelete, setOpenDelete] = useState(false); // Toggle for delete confirmation dialog
  const [openUpdate, setOpenUpdate] = useState(false); // Toggle for update confirmation dialog
  const [openAddMember, setOpenAddMember] = useState(false); // Toggle for add member popup
  const [userId, setUserId] = useState(""); // Track the user to delete or update
  const [selectedUser, setSelectedUser] = useState<any>(null); // Store selected user for updating

  // Fetch all users and mutations for delete/update
  const { isLoading, data, error, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [updateUserRole, { isSuccess: roleSuccess, error: roleError }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation();

  useEffect(() => {
    if (roleError) {
      const errorMessage =
        (roleError as any)?.data?.message || "Error updating role";
      toast.error(errorMessage);
    }

    if (deleteError) {
      const errorMessage =
        (deleteError as any)?.data?.message || "Error deleting user";
      toast.error(errorMessage);
    }

    if (roleSuccess) {
      toast.success("User role updated successfully!");
      refetch();
      setOpenUpdate(false);
    }

    if (deleteSuccess) {
      toast.success("User deleted successfully!");
      refetch();
      setOpenDelete(false);
    }
  }, [roleSuccess, roleError, deleteSuccess, deleteError, refetch]);

  const handleUpdateRole = async () => {
    if (selectedUser && role) {
      await updateUserRole({ email: selectedUser.email, role });
    } else {
      toast.error("Please fill in both email and role");
    }
  };

  const handleDelete = async () => {
    if (userId) {
      await deleteUser(userId);
    }
  };

  const handleAddMember = async () => {
    // Logic for adding new member
    if (!email || !role) {
      toast.error("Please provide both email and role");
      return;
    }
    // Add user mutation logic goes here...
    toast.success("New member added successfully!");
    setOpenAddMember(false); // Close the popup
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Purchased Course", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },

    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpenDelete(true);
            setUserId(params.row.id);
          }}
        >
          <AiOutlineDelete
            className={theme === "dark" ? "text-white" : "text-black"}
            size={20}
          />
        </Button>
      ),
    },
    {
      field: "",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => (
        <a
          className="justify-center items-center "
          href={`mailto:${params.row.email}`}
        >
          <AiOutlineMail
            className={theme === "dark" ? "text-white" : "text-black"}
            size={20}
          />
        </a>
      ),
    },
  ];

  const rows: any = [];
  if (isTeam) {
    const adminData = data?.users?.filter((user: any) => user.role === "admin");
    adminData?.forEach((user: any) => {
      rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        courses: user.courses.length,
        created_at: format(user.createdAt),
      });
    });
  } else {
    data?.users?.forEach((user: any) => {
      rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        courses: user.courses.length,
        created_at: format(user.createdAt),
      });
    });
  }

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Add New Member Popup */}

          <Box m="20px">
            {/* Button to open add member popup */}
            <div className="w-full flex justify-end ">
              <div
                className={`${style.button} !w-[200px]  dark:bg-black dark:text-white dark:border dark:border-[#ffffff6c] `}
                onClick={() => setOpenAddMember(true)}
              >
                Add New member
              </div>
            </div>
            <Modal open={openAddMember} onClose={() => setOpenAddMember(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" component="h2">
                  Add New Member
                </Typography>
                <TextField
                  fullWidth
                  className="m-5"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Select
                  fullWidth
                  className="m-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value as string)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                    variant="contained"
                    onClick={handleAddMember}
                    sx={{ borderRadius: "20px" }}
                  >
                    Add Member
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenAddMember(false)}
                    sx={{ borderRadius: "20px" }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* DataGrid to display users */}
            <Box
              m="40px 0 0 0"
              height="80vh"
              sx={{
                "& .MuiDataGrid-root": { border: "none", outline: "none" },
                "& .MuiDataGrid-row": {
                  color: theme === "dark" ? "#fff" : "#000",
                },
              }}
            >
              <DataGrid rows={rows} columns={columns} checkboxSelection />
            </Box>

            {/* Delete Confirmation Popup */}
            <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" component="h2">
                  Confirm Delete
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Are you sure you want to delete this user?
                </Typography>
                <Box mt={4} display="flex" justifyContent="space-between">
                  <Button
                    variant="contained"
                    onClick={handleDelete}
                    color="error"
                    sx={{ borderRadius: "20px" }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenDelete(false)}
                    sx={{ borderRadius: "20px" }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        </>
      )}
    </div>
  );
};

export default AllCourses;
