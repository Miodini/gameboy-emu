import { WorkerTypes as WT } from '../../types'

const startAddressInput = document.getElementById('memStart') as HTMLInputElement
const endAddressInput = document.getElementById('memEnd') as HTMLInputElement
const dumpButton = document.getElementById('memDump') as HTMLButtonElement

export const startMemoryDumper = (worker: Worker) => {  
  startAddressInput.addEventListener('input', () => {
    startAddressInput.value = startAddressInput.value.replace(/[^0-9a-fA-F]/g, '')
  })
  endAddressInput.addEventListener('input', () => {
    endAddressInput.value = endAddressInput.value.replace(/[^0-9a-fA-F]/g, '')
  })

  dumpButton.addEventListener('click', () => {
    const startAddress = parseInt(startAddressInput.value, 16) || 0
    const endAddress = Math.max(startAddress, parseInt(endAddressInput.value, 16) || 0)
    const message: WT.DumpMessagePayload = {
      startAddress,
      endAddress
    }

    worker.postMessage({
      messageType: WT.MessageType.Dump,
      payload: message
    })
  })
}