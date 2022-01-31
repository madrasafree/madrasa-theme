$(function () {
  // get the enrolled courses of the current user
  function getEnrolledCourses() {
    var data = $.ajax({
      url: `${domain}/api/enrollment/v1/enrollment`,
      type: "GET",
      dataType: "json",
      async: false,
      xhrFields: {
        withCredentials: true,
      },
    }).responseJSON;
    data = data.map(function (course) {
      return {
        url: `${domain}/courses/${course.course_details.course_id}`,
        image: "",
        name: course.course_details.course_name,
        id: course.course_details.course_id,
      };
    });
    return data;
  }

  // get the public Madrasa's catalog
  function getCatalog() {
    var data = $.ajax({
      url: `${domain}/api/courses/v1/courses`,
      type: "GET",
      dataType: "json",
      async: false,
      xhrFields: {
        withCredentials: true,
      },
    }).responseJSON.results;
    data = data.map(function (course) {
      return {
        url: `${domain}/courses/${course.id}`,
        image: course.media.image.raw,
        name: course.name,
        id: course.id,
      };
    });
    return data;
  }

  // build UI of course block
  function createCourseBlock(name, imageURL, url, isEnrolled = false) {
    let course = $(`<div onclick="location.href='${url}'" class="course">`);
    let image = $(`<img src="${imageURL}" alt="${name}">`);
    let title = $(`<h3>${name}</h3>`);
    let link;
    if (isEnrolled) {
      link = $(
        `<a class="course-link enrolled-link" href="${url}">המשיכו ללמוד</a>`
      );
    } else {
      link = $(`<a class="course-link" href="${url}">הרשמה לקורס</a>`);
    }
    course.append(image).append(title).append(link);
    return course;
  }

  //get the current domain
  var domain = `https://${document.location.hostname}`;
  var username = $.ajax({
    url: `${domain}/api/user/v1/me`,
    type: "GET",
    dataType: "json",
    async: false,
    xhrFields: {
      withCredentials: true,
    },
  }).responseJSON.username;

  let enrolledCourses = [];
  try {
    enrolledCourses = getEnrolledCourses();
  } catch (err) {
    console.log("Error: " + err.message);
  }

  enrolledCourses.forEach(function (course) {
    var data = [];
    try {
      data = $.ajax({
        url: `${domain}/api/courses/v1/courses/${course.id}?username=${username}`,
        type: "GET",
        dataType: "json",
        async: false,
        xhrFields: {
          withCredentials: true,
        },
        success: function (data) {
          course.image = data.media.image.raw;
        },
      });
    } catch (err) {
      console.log("Error: " + err.message);
    }
  });

  let catalog = [];
  try {
    catalog = getCatalog();
  } catch (err) {
    console.log("Error: " + err.message);
  }

  // filter unenrolled courses
  let unenrolledCourses = catalog.filter(function (course) {
    let enrolledIds = enrolledCourses.map((course) => course.id);
    return !enrolledIds.includes(course.id);
  });

  console.log(enrolledCourses);

  // add enrolled courses to courses section
  if (enrolledCourses.length != 0) {
    enrolledCourses.forEach(function (course) {
      $(".courses").append(
        createCourseBlock(course.name, course.image, course.url, true)
      );
    });
  }
  // add unenrolled courses to courses section
  if (unenrolledCourses.length != 0) {
    unenrolledCourses.forEach(function (course) {
      $(".courses").append(
        createCourseBlock(course.name, course.image, course.url)
      );
    });
  }
});
