import { Op } from "sequelize"
import { sequelize } from "../config/database"
import StudentGrade from "../models/studentGradeModel"

export const registerStudentsGradeService = async (data: any[]) => {
    const transaction = await sequelize.transaction()
    try {
        // Bulk Insert terlebih dahulu
        await StudentGrade.bulkCreate(data, {
            ignoreDuplicates: true,
            transaction: transaction
        })
        // Get Existing Student berdasarkan gradeId dan academicYearId
        const existingStudents = await StudentGrade.findAll({
            where: {
                gradeId: data[0].gradeId,
                academicYearId: data[0].academicYearId
            },
            transaction: transaction
        })
        // Bandingkan existing dengan data kiriman FE
        const existing = existingStudents.map(item => item.studentId)
        const newStudent = data.map(item => item.studentId)

        // Hapus data yang tidak ditemukan antara existing dan new
        const studentToDelete = existing.filter(id => !newStudent.includes(id))
        if (studentToDelete.length > 0) {
            await StudentGrade.destroy({
                where: {
                    studentId: {
                        [Op.in]: studentToDelete
                    },
                    gradeId: data[0].gradeId,
                    academicYearId: data[0].academicYearId
                },
                transaction: transaction
            })
        }
        transaction.commit()
    } catch (error) {
        transaction.rollback()
        throw error
    }
}