import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../config/database";

class AcademicYear extends Model<InferAttributes<AcademicYear>, InferCreationAttributes<AcademicYear>> {
    declare id: CreationOptional<string>
    declare name: string
    declare startDate: Date
    declare endDate: Date
    declare status: string
}

AcademicYear.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['A', 'I']
        }
    },
    {
        sequelize,
        modelName: 'academic_year'
    }
)

export default AcademicYear