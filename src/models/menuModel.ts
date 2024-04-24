import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Submenu from "./submenuModel";

class Menu extends Model<InferAttributes<Menu>, InferCreationAttributes<Menu>> {
    declare id: CreationOptional<number>
    declare name: string
    declare icon: string
    declare level: number
    declare hasChild: boolean
    declare url: CreationOptional<string>
    declare isActive: boolean
    declare submenus?: NonAttribute<Submenu[]>
}

Menu.init(
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
        icon: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hasChild: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        url: {
            type: DataTypes.STRING
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        modelName: 'menu'
    }
)

export default Menu