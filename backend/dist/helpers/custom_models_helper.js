"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Custom Student with user = {email,password, token}
function getCustomStudent(student, user) {
    var result = { _id: student._id, name: student.name, university: student.university, degree: student.degree, user: user,
        ratings: student.ratings, trophies: student.trophies, insignias: student.insignias,
        chats: student.chats, courses: student.courses
    };
    return result;
}
exports.default = {
    getCustomStudent: getCustomStudent
};
//# sourceMappingURL=custom_models_helper.js.map