const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let nextStudentId = 3;
let nextCourseId = 3;

const students = [
    { id: 1, name: "Ali", age: 20 },
    { id: 2, name: "Sara", age: 22 }
];

const courses = [
    { id: 1, title: "Web Services" },
    { id: 2, title: "Databases" }
];

function getStudentById(id) {
    return students.find((student) => student.id === id);
}

function studentLinks(studentId) {
    return {
        self: `/students/${studentId}`,
        collection: "/students",
        courses: "/courses"
    };
}

function validateStudentPayload(body) {
    const { name, age } = body;

    if (typeof name !== "string" || !name.trim()) {
        return "Field 'name' is required and must be a non-empty string.";
    }

    if (!Number.isInteger(age) || age <= 0) {
        return "Field 'age' is required and must be a positive integer.";
    }

    return null;
}

app.get("/", (_req, res) => {
    res.status(200).json({
        message: "Student Management API",
        links: {
            students: "/students",
            courses: "/courses"
        }
    });
});

app.get("/students", (_req, res) => {
    const data = students.map((student) => ({
        ...student,
        links: studentLinks(student.id)
    }));

    res.status(200).json({ data, count: data.length });
});

app.get("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Student id must be a positive integer." });
    }

    const student = getStudentById(id);

    if (!student) {
        return res.status(404).json({ error: "Student not found." });
    }

    return res.status(200).json({
        data: {
            ...student,
            links: studentLinks(student.id)
        }
    });
});

app.post("/students", (req, res) => {
    const validationError = validateStudentPayload(req.body);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const newStudent = {
        id: nextStudentId++,
        name: req.body.name.trim(),
        age: req.body.age
    };

    students.push(newStudent);

    return res.status(201).json({
        data: {
            ...newStudent,
            links: studentLinks(newStudent.id)
        }
    });
});

app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Student id must be a positive integer." });
    }

    const student = getStudentById(id);

    if (!student) {
        return res.status(404).json({ error: "Student not found." });
    }

    const validationError = validateStudentPayload(req.body);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    student.name = req.body.name.trim();
    student.age = req.body.age;

    return res.status(200).json({
        data: {
            ...student,
            links: studentLinks(student.id)
        }
    });
});

app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Student id must be a positive integer." });
    }

    const index = students.findIndex((student) => student.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Student not found." });
    }

    const [deletedStudent] = students.splice(index, 1);

    return res.status(200).json({
        data: {
            ...deletedStudent,
            links: {
                collection: "/students",
                courses: "/courses"
            }
        }
    });
});

app.get("/courses", (_req, res) => {
    const data = courses.map((course) => ({
        ...course,
        links: {
            self: `/courses/${course.id}`,
            collection: "/courses",
            students: "/students"
        }
    }));

    res.status(200).json({ data, count: data.length });
});

app.get("/courses/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Course id must be a positive integer." });
    }

    const course = courses.find((item) => item.id === id);

    if (!course) {
        return res.status(404).json({ error: "Course not found." });
    }

    return res.status(200).json({
        data: {
            ...course,
            links: {
                self: `/courses/${course.id}`,
                collection: "/courses",
                students: "/students"
            }
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found.",
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Student Management API running on port ${PORT}`);
});
