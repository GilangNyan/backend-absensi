import { sequelize } from "../config/database";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import Role from "./roleModel";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>
    declare email: CreationOptional<string>
    declare username: string
    declare password: string
    declare status: CreationOptional<string>
    declare changePassword: CreationOptional<boolean>
    declare roleId: ForeignKey<string>
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ['A', 'I', 'ALUM'],
            defaultValue: 'A'
        },
        changePassword: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'user'
    }
)

Role.hasMany(User)
User.belongsTo(Role)

export default User