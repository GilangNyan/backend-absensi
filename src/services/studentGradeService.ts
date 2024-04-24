import StudentGrade from "../models/studentGradeModel"

export const registerStudentsGradeService = async (data: any[]) => {
    const result = await StudentGrade.bulkCreate(data, {
        ignoreDuplicates: true
    })
    return result
}