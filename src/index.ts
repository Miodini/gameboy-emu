import Cpu from "./cpu/index.js"

const program = new Int8Array([0x01, 0xBA, 0x96])

const cpu = new Cpu(program)
cpu.start()