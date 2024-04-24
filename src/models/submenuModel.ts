import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import Menu from "./menuModel";

class Submenu extends Model<InferAttributes<Submenu>, InferCreationAttributes<Submenu>> {
    declare id: CreationOptional<number>
    declare name: string
    declare level: number
    declare url: string
    declare menuId: ForeignKey<number>
    declare isActive: boolean
}

Submenu.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        modelName: 'submenu'
    }
)

Menu.hasMany(Submenu)
Submenu.belongsTo(Menu)

export default Submenu