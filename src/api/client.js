// JsonSchool Asynchronous API Client Simulation
// Ushbu modul haqiqiy REST API kabi asinxron ishlaydi, kechikish (latency) va xatoliklarni boshqaradi

const SIMULATED_DELAY = 180 // ms

export const delay = (ms = SIMULATED_DELAY) => new Promise((resolve) => setTimeout(resolve, ms))

export class ApiResponse {
  constructor({ success = true, data = null, message = '', status = 200, meta = null }) {
    this.success = success
    this.data = data
    this.message = message
    this.status = status
    this.meta = meta
  }

  static ok(data, message = 'Muvaffaqiyatli bajarildi', meta = null) {
    return new ApiResponse({ success: true, data, message, status: 200, meta })
  }

  static created(data, message = 'Muvaffaqiyatli yaratildi') {
    return new ApiResponse({ success: true, data, message, status: 201 })
  }

  static error(message = 'Xatolik yuz berdi', status = 400) {
    return new ApiResponse({ success: false, data: null, message, status })
  }
}
