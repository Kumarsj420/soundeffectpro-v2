'use client'

import AddToSbModal from './Ats'
import DelAcc from './DelAcc'
import CreateSoundboardModal from './CreateSoundboard'
import DelSound from './DelSound'

export default function Modal_Root() {
  return (
   <>
    <AddToSbModal />
    <DelAcc />
    <CreateSoundboardModal />
    <DelSound />
   </>
  )
}
