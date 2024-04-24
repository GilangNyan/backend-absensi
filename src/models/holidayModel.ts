import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

class Holiday extends Model<InferAttributes<Holiday>, InferCreationAttributes<Holiday>> {
    declare id: CreationOptional<string>
    declare name: string
    declare date: string
    declare description: string
}

Holiday.init(
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
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'holiday'
    }
)

export default Holiday