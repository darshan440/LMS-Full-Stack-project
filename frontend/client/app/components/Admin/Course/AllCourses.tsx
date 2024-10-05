import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal, Typography } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCourseMutation,
  useGetAllCourseQuery,
} from "@/redux/features/courses/courseApi.ts/coursesApi";
import Loader from "../../Loader/Loader"; // Assuming you have a Loader component
import { format } from "timeago.js";
import { log } from "console";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme } = useTheme(); // Removed setTheme since it's not needed
  const { isLoading, data, refetch } = useGetAllCourseQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteCourse, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteCourseMutation();

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "rating", headerName: "Rating", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => (
        <Link href={`/admin/edit-course/${params.row.id}`}>
          <FiEdit2
            className={theme === "dark" ? "text-white" : "text-black"}
            size={20}
          />
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpen(!open);
            setCourseId(params.row.id);
          }}
        >
          <AiOutlineDelete
            className={theme === "dark" ? "text-white" : "text-black"}
            size={20}
          />
        </Button>
      ),
    },
  ];

  // Creating rows from fetched data
  const rows =
    data?.courses?.map((item: any) => ({
      id: item._id,
      title: item.name,
      rating: item.ratings,
      purchased: item.purchased,
      created_at: format(item.createdAt),
    })) || [];

  useEffect(() => {
    if (deleteSuccess) {
      setOpenDelete(false);
      refetch();
      toast.success("Course Deleted Successfully.");
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [deleteSuccess, deleteError, refetch]);
  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
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
                Are you sure you want to delete this course?
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
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiSvgIcon-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#000" : "#fff",
                color: theme === "dark" ? "#000" : "#000",
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? "#b7ebde !important" : "#000 !important",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color:
                  theme === "dark" ? "#b7ebde !important" : "#000 !important",
              },
            }}
          >
            <DataGrid rows={rows} columns={columns} checkboxSelection />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
