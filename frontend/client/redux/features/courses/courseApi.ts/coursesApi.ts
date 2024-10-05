import { apiSlice } from "../../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCourse: builder.query({
      query: () => ({
        url: "get-admin-courses",
        method: "GET",

        credentials: "include" as const,
      }),
    }),
    getCourseById: builder.query({
      query: (id: string) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-courses/${id}`,
        method: "DELETE",

        credentials: "include" as const,
      }),
    }),

    editCourse: builder.mutation({
      query: ({id,data}) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCourseQuery,
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
  useEditCourseMutation,
} = courseApi;
