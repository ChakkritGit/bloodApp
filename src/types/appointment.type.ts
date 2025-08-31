type AppointmentState = {
  f_appidno: string | undefined
  f_appcreatebyname: string
  f_appcreateforhn: string
  f_appcreateforname: string
  f_appcreatecontacttelephone: string
  f_appcreatecontacttelephonetwo: string
  f_appcreatecontactaddress: string
  f_appcreatecontactlat: string
  f_appcreatecontactlon: string
  f_appdoctorduedate: string
  f_apppictureappdoc: string
  selectedFile: File | null
}

type Appointment = {
  f_appidno: string
  f_appidgroup: number
  f_appidname?: string | null
  f_appstepno: number
  f_appcreatebyname: string
  f_appcreatedatetime?: string | null
  f_appcreateforhn: string
  f_appcreateforname: string
  f_appcreatefordatetime?: string | null
  f_appcreateconfirmname?: string | null
  f_appcreateconfirmdatetime?: string | null
  f_appcreatecontacttelephone: string
  f_appcreatecontacttelephonetwo: string
  f_appcreatecontactaddress: string
  f_appcreatecontactlat: string
  f_appcreatecontactlon: string
  f_appcreatecontactacc?: string | null
  f_appdoctorduedate: string
  f_appadminduedate?: string | null
  f_appadmindueque: number
  f_appadminduequemax: number
  f_appadminconfirmdate?: string | null
  f_appadminconfirmtime?: string | null
  f_appadminconfirmque: number
  f_appadminconfirmvisitedate?: string | null
  f_appcancelname?: string | null
  f_appcanceldatetime?: string | null
  f_apppayby?: string | null
  f_apppaydatetime?: string | null
  f_apppayprice: string
  f_apppictureappdoc?: string | null
  f_apppictureappdocdatetime?: string | null
  f_apppicturelisttestdoc?: string | null
  f_apppicturelisttestdocdatetime?: string | null
  f_apppicturebloodtube?: string | null
  f_apppicturebloodtubedatetime?: string | null
  f_apppictureslipdoc?: string | null
  f_apppictureslipdocdatetime?: string | null
  f_apppicturepatient?: string | null
  f_apppicturepatientdatetime?: string | null
  f_apppictureuser?: string | null
  f_apppictureuserdatetime?: string | null
  f_appadminvisitfullname?: string | null
  f_appadminvisittelephone?: string | null
  f_appadminvisitdatetime?: string | null
  f_apppatientproveinfodatetime?: string | null
  f_apppatientproveinfostatus: string
  f_apppatientproveinfobyname?: string | null
  f_appcomment?: string | null
  f_appstatus: string
  f_appbastatus: string
  f_applastmodified?: string | null
  files: AppointmentFiles
}

type AppointmentFiles = {
  appointment: AppointmentImage | null
  slip: AppointmentImage | null
  testListDocs: AppointmentImage[]
  bloodTubes: AppointmentImage[]
  others: AppointmentImage[]
}

type AppointmentImage = {
  f_appimageidno: string
  f_appimageidtype: number
  f_appimageidname?: string | null
  f_appimageidpart: string
  f_appimageidrefno: string
  f_appimageidstatus: string
  f_appimageidbastatus: string
  f_appimageidlastmodified?: string | null
}

export type { Appointment, AppointmentState }
