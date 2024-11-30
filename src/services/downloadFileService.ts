import { Response } from "express"
import * as XLSX from "xlsx"
import * as path from "path"
import * as fs from "fs"
import * as puppeteer from "puppeteer"
import * as ejs from "ejs"
import Student from "../models/studentModel"
import Grade from "../models/gradeModel"
import Attendance from "../models/attendanceModel"
import { formatDate, getTotalDaysByMonth } from "../utils/utility"
import { getGradeByIdService } from "./gradeService"
import { getAcademicYearByDateService, getRecentAcademicYearService } from "./academicYearService"
import { getConfigByKeyService } from "./configService"

export interface IDataStructure {
  rows: Student[]
  dayOff: number
  month: number
  year: number
}

type DataTypes = 'daily-attendance' | 'monthly-attendance' | 'yearly-attendance'

export const downloadXlsx = (res: Response, data: IDataStructure | Student[], type: DataTypes, title: string) => {
  const date = new Date()
  const filename = `${type}_${date.toDateString()}`

  const workbook = XLSX.utils.book_new()
  let worksheet = null

  if (type == 'daily-attendance') {
    worksheet = generateDailyAttendanceFile((data as Student[]))
  } else if (type == 'monthly-attendance') {
    worksheet = generateMonthlyAttendanceFile((data as IDataStructure))
  } else if (type == 'yearly-attendance') {
    // 
  } else {
    worksheet = XLSX.utils.json_to_sheet(data as any)
  }

  XLSX.utils.book_append_sheet(workbook, worksheet!, 'Sheet1')

  const filePath = path.join(__dirname, `${filename}.xlsx`)
  XLSX.writeFile(workbook, filePath)

  res.setHeader('Content-Disposition', `attachment;filename=${filename}.xlsx`);
  res.download(filePath, `${filename}.xlsx`, (err) => {
    if (err) {
      console.error('Error saat download file: ', err)
      throw new Error('Terjadi kesalahan saat download file')
    } else {
      fs.unlinkSync(filePath)
    }
  })
}

export const downloadPdf = async (res: Response, data: IDataStructure | Student[], type: DataTypes, grade: string, date: string) => {
  const filePath = path.join(__dirname, '../assets', 'html', `${type}.ejs`);
  const logoPath = path.join(__dirname, '../assets', 'images', 'jawabarat_logo.png')
  const cssPath = path.join(__dirname, '../assets', 'css', 'style.css')
  const base64Logo = fs.readFileSync(logoPath, 'base64')
  const cssBase = fs.readFileSync(cssPath)

  const grades = await getGradeByIdService(grade)
  const getFirstAcad = await getConfigByKeyService('first-academic-month')
  const firstAcademicMonth = parseInt(getFirstAcad.dataValues.value)
  const d = new Date(date)
  let startYear
  let endYear
  if (d.getMonth() < firstAcademicMonth) {
    startYear = d.getFullYear() - 1
    endYear = d.getFullYear()
  } else {
    startYear = d.getFullYear()
    endYear = d.getFullYear() + 1
  }
  const startDate = new Date(startYear, firstAcademicMonth, 1)
  const endDate = new Date(endYear, firstAcademicMonth, 0)
  endDate.setHours(23, 59, 59)
  const academicYear = await getAcademicYearByDateService(startDate, endDate)
  const arrayData = []

  let summary = {
    hadir: 0,
    sakit : 0,
    izin : 0,
    alpa : 0
  }

  if (type == 'daily-attendance') {
    const entryData = (data as Student[])
    for (const [index, item] of entryData.entries()) {
      const grades = ((item.dataValues as any).grades as Grade[])
      const attendances = ((item.dataValues as any).attendances[0] as Attendance)
      const hadir = attendances && attendances.dataValues.status == 'H' ? 1 : 0
      const sakit = attendances && attendances.dataValues.status == 'S' ? 1 : 0
      const izin = attendances && attendances.dataValues.status == 'I' ? 1 : 0
      const alpa = attendances && attendances.dataValues.status == 'A' ? 1 : (!attendances ? 1 : 0)
      const entry = {
        ord: index + 1,
        name: item.dataValues.fullname,
        grade: grades[0].name,
        hadir, sakit, izin, alpa
      }
      arrayData.push(entry)
      summary.hadir += hadir
      summary.sakit += sakit
      summary.izin += izin
      summary.alpa += alpa
    }
  } else if (type == 'monthly-attendance') {
    // arrayData = generateMonthlyAttendanceFile((data as IDataStructure))
  } else if (type == 'yearly-attendance') {
    // 
  } else {
    // arrayData = XLSX.utils.json_to_sheet(data as any)
  }

  const html = await ejs.renderFile(filePath, {
    logo: base64Logo,
    grade: grades.dataValues.name,
    date: formatDate(date),
    academicYear: academicYear?.dataValues.name,
    cssBase: cssBase,
    data: arrayData,
    summary: summary
  })

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(html)

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '20mm',
      right: '20mm'
    }
  })
  await browser.close()

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment;filename=${type}.pdf`);
  res.end(pdfBuffer)
}

const generateDailyAttendanceFile = (data: Student[]): XLSX.WorkSheet => {
  const worksheetData = []

  // Bagian Judul
  worksheetData.push(['Nama', 'Kelas', 'Kehadiran', '', '', ''])
  worksheetData.push(['', '', 'Hadir', 'Sakit', 'Izin', 'Alpa'])

  for (const [index, item] of data.entries()) {
    const grades = ((item.dataValues as any).grades as Grade[])
    const attendances = ((item.dataValues as any).attendances[0] as Attendance)
    const hadir = attendances && attendances.dataValues.status == 'H' ? 1 : 0
    const sakit = attendances && attendances.dataValues.status == 'S' ? 1 : 0
    const izin = attendances && attendances.dataValues.status == 'I' ? 1 : 0
    const alpa = attendances && attendances.dataValues.status == 'A' ? 1 : (!attendances ? 1 : 0)
    worksheetData.push([item.dataValues.fullname, grades[0].name, hadir, sakit, izin, alpa])
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Menggabungkan A1 dan A2
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Menggabungkan B1 dan B2
    { s: { r: 0, c: 2 }, e: { r: 0, c: 5 } },  // Menggabungkan C1 hingga F1
    // { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } }  // Menggabungkan G1 dan G2
  ];

  return worksheet
}

const generateMonthlyAttendanceFile = (data: IDataStructure): XLSX.WorkSheet => {
  const worksheetData = []

  const weekdays = getTotalDaysByMonth(data.year, data.month) - data.dayOff

  // Bagian Judul
  worksheetData.push(['Nama', 'Kelas', 'Kehadiran', '', '', ''])
  worksheetData.push(['', '', 'Hadir', 'Sakit', 'Izin', 'Alpa'])

  for (const [index, item] of data.rows.entries()) {
    const grades = ((item.dataValues as any).grades as Grade[])
    const attendances = ((item.dataValues as any).attendances as any)
    const hadir = attendances && attendances.dataValues.hadir ? parseInt(attendances.dataValues.hadir) : 0
    const sakit = attendances && attendances.dataValues.sakit ? parseInt(attendances.dataValues.sakit) : 0
    const izin = attendances && attendances.dataValues.izin ? parseInt(attendances.dataValues.izin) : 0
    const alpa = attendances ? weekdays - (hadir + sakit + izin) : 0 + weekdays
    worksheetData.push([item.dataValues.fullname, grades[0].name, hadir, sakit, izin, alpa])
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Menggabungkan A1 dan A2
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Menggabungkan B1 dan B2
    { s: { r: 0, c: 2 }, e: { r: 0, c: 5 } },  // Menggabungkan C1 hingga F1
    // { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } }  // Menggabungkan G1 dan G2
  ];

  return worksheet
}