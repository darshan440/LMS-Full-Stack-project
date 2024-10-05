"use client";
import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOption from "./CourseOption";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/courses/courseApi.ts/coursesApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Use useRouter instead of redirect

type Props = {};

const CreateCourse = (props: Props) => {
  const [createCourse, { isLoading, isSuccess, error }] =
    useCreateCourseMutation();
  const router = useRouter(); // Initialize the router
  // --------------------------------------------------
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully!");
      router.push("/admin/all-courses"); // Use router to navigate
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message || "An error occurred");
      }
    }
  }, [isLoading, isSuccess, error]);
  // ----------------------------------------------------
  const [active, setActive] = useState(0);
  const [courseContent, setCourseContent] = useState({
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
  // ---------------------------------------------------------
  const handleSubmit = async () => {
    const formattedBenefits = courseContent.benefits.map((benefit) => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = courseContent.prerequisites.map(
      (prerequisite) => ({
        title: prerequisite.title,
      })
    );
    const formattedCourseContentData = courseContent.courseContent.map(
      (content) => ({
        videoUrl: content.videoUrl,
        title: content.title,
        description: content.description,
        videoSection: content.videoSection,
        links: content.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: content.suggestion,
      })
    );

    const updatedData = {
      ...courseContent,
      courseContent: formattedCourseContentData,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
    };

    setCourseContent(updatedData);
  };

  const handleCourseCreate = async (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Flatten courseInfo into top-level fields
    const data = {
      ...courseContent.courseInfo, // Flatten courseInfo
      benefits: courseContent.benefits,
      prerequisites: courseContent.prerequisites,
      courseContent: courseContent.courseContent,
    };

    if (!isLoading) {
      await createCourse(data);
    }
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseContent.courseInfo}
            setCourseInfo={(courseInfo) =>
              setCourseContent({ ...courseContent, courseInfo })
            }
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={courseContent.benefits}
            setBenefits={(benefits) =>
              setCourseContent({ ...courseContent, benefits })
            }
            prerequisites={courseContent.prerequisites}
            setPrerequisites={(prerequisites) =>
              setCourseContent({ ...courseContent, prerequisites })
            }
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            courseContentData={courseContent.courseContent}
            setCourseContentData={(newContent) =>
              setCourseContent({ ...courseContent, courseContent: newContent })
            }
            active={active}
            setActive={setActive}
            handleSubmit={handleSubmit}
          />
        )}

        {active === 3 && (
          <CoursePreview
            courseData={courseContent} 
            active={active}
            setActive={setActive}
            handleCourseCreate={handleCourseCreate}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOption active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default CreateCourse;
