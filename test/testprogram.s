; Simple Game Boy Assembly Program to Sum Two Numbers
; This program adds two numbers and stores the result in RAM.

SECTION "SumTwoNumbers", ROM0

START:
  LD A, $05       ; Load the first number (5) into register A
  LD B, $03       ; Load the second number (3) into register B
  ADD A, B        ; Add the value in register B to register A
  LD [$C000], A   ; Store the result in RAM address $C000

  STOP 0       ; Stop the program (halt execution)