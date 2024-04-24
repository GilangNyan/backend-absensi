import User from "./userModel";
import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";

class Student extends Model<InferAttributes<Student>, InferCreationAttributes<Student>> {
    declare id: CreationOptional<string>
    declare nisn: string
    declare nipd: string
    declare fullname: string
    declare gender: string
    declare birthPlace: string
    declare birthDate: string
}

Student.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        nisn: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nipd: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['L', 'P']
        },
        birthPlace: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'student'
    }
)

export default Student