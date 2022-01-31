$(function () {
  function getEnrolledCourses() {
    var data = $.ajax({
      url: domain + "api/enrollment/v1/enrollment",
      type: "GET",
      dataType: "json",
      async: false,
      xhrFields: {
        withCredentials: true,
      },
    }).responseJSON;
    return data;
  }

  function getCatalog() {
    var data = $.ajax({
      url: domain + "api/courses/v1/courses",
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

  var domain = "https://" + hostname;


  let enrolledCourses = [
    {
      id: "course-v1:madrasa+course2+2019_1",
      name: "ערבית מדוברת - ממשיכים",
      image:
        "https://madrasafree.com/asset-v1:madrasa+maayan2+2020+type@asset+block@intermediate.png",
      url: "https://madrasafree.com/courses/course-v1:madrasa+course2+2019_1/course/",
    },
  ];

  let catalog = getCatalog();

  let unenrolledCourses = catalog.filter(function (course) {
    let enrolledIds = enrolledCourses.map((course) => course.id);
    return !enrolledIds.includes(course.id);
  });

  if (false) {
  } else {
    enrolledCourses.forEach(function (course) {
      $(".courses").append(
        createCourseBlock(course.name, course.image, course.url, true)
      );
    });
  }

  unenrolledCourses.forEach(function (course) {
    $(".courses").append(
      createCourseBlock(course.name, course.image, course.url)
    );
  });
});
