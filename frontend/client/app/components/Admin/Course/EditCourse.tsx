"use client";
import React, { FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOption from "./CourseOption";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
} from "../../../../redux/features/courses/courseApi.ts/coursesApi"; // Use a specific query for one course
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = { id: string };

const EditCourse: FC<Props> = ({ id }) => {
  const [editCourse, { isSuccess, error }] = useEditCourseMutation();
  const {
    isLoading,
    data: editCourseData,
    refetch,
  } = useGetCourseByIdQuery(id);
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course changed successfully");
      redirect("/admin/all-course");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  });
  const [active, setActive] = useState(0);

  const [courseData, setCourseData] = useState({
    courseInfo: {
      name: "",
      description: "",
      price: "",
      estimatedPrice: "",
      tags: "",
      level: "",
      demoUrl: "",
      thumbnail: "",
    },
    benefits: [{ title: "" }],
    prerequisites: [{ title: "" }],
    courseContent: [
      {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: "",
        links: [{ title: "", url: "" }],
        suggestion: "",
      },
    ],
  });

  useEffect(() => {
    if (editCourseData) {
      // Set the entire courseData object
      setCourseData({
        courseInfo: {
          name: editCourseData.name,
          description: editCourseData.description,
          price: editCourseData.price,
          estimatedPrice: editCourseData.estimatedPrice, // fixed typo
          tags: editCourseData.tags,
          level: editCourseData.level,
          demoUrl: editCourseData.demoUrl,
          thumbnail: editCourseData.thumbnail,
        },
        benefits: editCourseData.benefits || [{ title: "" }],
        prerequisites: editCourseData.prerequisites || [{ title: "" }],
        courseContent: editCourseData.courseContent || [
          {
            videoUrl: "",
            title: "",
            description: "",
            videoSection: "",
            links: [{ title: "", url: "" }],
            suggestion: "",
          },
        ],
      });
    }
  }, [editCourseData]);

  const handleSubmit = async () => {
    // Format benefits, prerequisites, and course content
    const formattedBenefits = courseData.benefits.map((benefit) => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = courseData.prerequisites.map(
      (prerequisite) => ({
        title: prerequisite.title,
      })
    );
    const formattedCourseContentData = courseData.courseContent.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
      })
    );

    const updatedData = {
      ...courseData,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
    };

    setCourseData(updatedData);
  };

  const handleCourseUpdate = async (e: any) => {
    const data = courseData;
    await editCourseData({id:editCourseData?._id,data});
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseData.courseInfo}
            setCourseInfo={(courseInfo) =>
              setCourseData({ ...courseData, courseInfo })
            }
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={courseData.benefits}
            setBenefits={(benefits) =>
              setCourseData({ ...courseData, benefits })
            }
            prerequisites={courseData.prerequisites}
            setPrerequisites={(prerequisites) =>
              setCourseData({ ...courseData, prerequisites })
            }
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            courseContentData={courseData.courseContent}
            setCourseContentData={(newContent) =>
              setCourseData({ ...courseData, courseContent: newContent })
            }
            active={active}
            setActive={setActive}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            courseData={courseData}
            active={active}
            setActive={setActive}
            handleCourseCreate={handleCourseUpdate} // Changed to handle course update
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOption active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
