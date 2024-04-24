import User from "./userModel";
import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";

class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
    declare id: CreationOptional<string>
    declare nip: string
    declare fullname: string
    declare gender: string
    declare birthPlace: string
    declare birthDate: string
    declare userId: ForeignKey<string>
}

Employee.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        nip: {
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
        modelName: 'employee'
    }
)

User.hasMany(Employee)
Employee.belongsTo(User, {
    foreignKey: {
        allowNull: true
    }
})

export default Employee