import { ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Student from "./studentModel";
import AcademicYear from "./academicYearModel";
import Grade from "./gradeModel";

class StudentGrade extends Model<InferAttributes<StudentGrade>, InferCreationAttributes<StudentGrade>> {
    declare studentId: ForeignKey<string>
    declare gradeId: ForeignKey<string>
    declare academicYearId: ForeignKey<string>
}

StudentGrade.init(
    {},
    {
        sequelize,
        modelName: 'student_grade',
        timestamps: false
    }
)

Student.hasMany(StudentGrade)
StudentGrade.belongsTo(Student)
Grade.hasMany(StudentGrade)
StudentGrade.belongsTo(Grade)
AcademicYear.hasMany(StudentGrade)
StudentGrade.belongsTo(AcademicYear)

export default StudentGrade