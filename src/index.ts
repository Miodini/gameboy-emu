import Memory from "./memory"
import BgPpu from "./ppu/bgPpu"

const mem = new Memory()
const gpu = new BgPpu(mem)

gpu._test()