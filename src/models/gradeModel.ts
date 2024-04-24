import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Grade extends Model<InferAttributes<Grade>, InferCreationAttributes<Grade>> {
    declare id: CreationOptional<string>
    declare name: string
}

Grade.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'grade'
    }
)

export default Grade