import Memory from "./memory"
import Ppu from "./ppu"

const mem = new Memory()
const ppu = new Ppu(mem)

ppu._test()