import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import Role from "./roleModel";
import Menu from "./menuModel";
import Submenu from "./submenuModel";

class RoleAccess extends Model<InferAttributes<RoleAccess>, InferCreationAttributes<RoleAccess>> {
    declare menuId: ForeignKey<number>
    // declare submenuId: ForeignKey<number>
    declare roleId: ForeignKey<string>
}

RoleAccess.init(
    {},
    {
        sequelize,
        modelName: 'role_access',
        timestamps: false
    }
)

Role.belongsToMany(Menu, {through: RoleAccess})
Menu.belongsToMany(Role, {through: RoleAccess})
// Role.belongsToMany(Submenu, {through: RoleAccess})
// Submenu.belongsToMany(Role, {through: RoleAccess})

export default RoleAccess