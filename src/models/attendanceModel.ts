import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import Student from "./studentModel";
import Grade from "./gradeModel";
import AcademicYear from "./academicYearModel";

class Attendance extends Model<InferAttributes<Attendance>, InferCreationAttributes<Attendance>> {
    declare id: CreationOptional<string>
    declare date: string
    declare status: string
    declare studentId: ForeignKey<string>
    declare gradeId: ForeignKey<string>
    declare academicYearId: ForeignKey<string>
}

Attendance.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['H', 'S', 'I', 'A']
        }
    },
    {
        sequelize,
        modelName: 'attendance'
    }
)

Student.hasMany(Attendance)
Attendance.belongsTo(Student)

Grade.hasMany(Attendance)
Attendance.belongsTo(Grade)

AcademicYear.hasMany(Attendance)
Attendance.belongsTo(AcademicYear)

export default Attendance