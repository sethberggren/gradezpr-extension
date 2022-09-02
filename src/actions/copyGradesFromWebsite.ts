export default function copyGradesFromWebsite() {
  const supportedWebsitesUrl = ["classroom.google.com"];

  const supportedWebsitesName = ["Google Classroom"];

  const supportedWebsitesBlurb = `Sorry, this website isn't currently supported by Gradezpr's grade copying function.  Supported websites include: ${supportedWebsitesName.join(
    ", "
  )}.`;

  if (!supportedWebsitesUrl.some((url) => window.location.href.includes(url))) {
    alert(supportedWebsitesBlurb);
    return;
  }
  const allTables = document.querySelectorAll("table");

  let allStudentsContainer: HTMLElement | null = null;

  for (const table of allTables) {
    if (table.hasAttribute("role")) {
      allStudentsContainer = table;
      break;
    }
  }

  if (allStudentsContainer === null) {
    alert(supportedWebsitesBlurb);
    return;
  }

  // get all the tr inside the student container that have the "data-student-id property"

  const studentContainerRows = allStudentsContainer.querySelectorAll("tr");

  const studentRows: HTMLElement[] = [];

  for (const studentContainerRow of studentContainerRows) {
    if (studentContainerRow.hasAttribute("data-student-id")) {
      studentRows.push(studentContainerRow);
    }
  }

  // now, parse all the student data

  const nameRegex = /(?<=\t\n)(.*?)(?=\n\t)/;
  const totalPointsRegex = /(?<=out of)(.*?)(?=\n)/;
  const earnedPointsRegex = /(?<=\n)(.*?)(?=out of)/;

  const parsedGrades: StudentGrade[] = [];

  for (const studentRow of studentRows) {
    const studentNameMatch = nameRegex.exec(studentRow.innerText);

    const totalPointsMatch = totalPointsRegex.exec(studentRow.innerText);

    const earnedPointsMatch = earnedPointsRegex.exec(studentRow.innerText);

    if (studentNameMatch && totalPointsMatch && earnedPointsMatch) {
      const studentName = studentNameMatch[0].trim();
      const totalPoints = parseFloat(totalPointsMatch[0].trim());
      const earnedPoints = parseFloat(earnedPointsMatch[0].trim());

      const rawGrade = (earnedPoints / totalPoints) * 100;

      parsedGrades.push({ name: studentName, grade: rawGrade });
    }
  }

  chrome.storage.local.set({ parsedGrades: parsedGrades }, () =>
    alert(`Copied ${parsedGrades.length} grades.`)
  );
}
