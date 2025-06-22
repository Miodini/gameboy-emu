import Memory from "./memory"
import Ppu from "./ppu"
import Cpu from "./cpu"

const cpu = new Cpu()
// const mem = new Memory()
// const ppu = new Ppu(mem)


const fileInput = document.getElementById('fileInput') as HTMLInputElement

fileInput.addEventListener('change', event => {
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0]
    const reader = new FileReader()
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const fileContent = new Int8Array(reader.result)

        cpu.mem.rom = fileContent
        // cpu.start()
      }
    }
    reader.readAsArrayBuffer(file)
  }
})