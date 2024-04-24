import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

class Config extends Model<InferAttributes<Config>, InferCreationAttributes<Config>> {
    declare id: CreationOptional<string>
    declare key: string
    declare value: string
    declare description: string
}

Config.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        key: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'config'
    }
)

export default Config