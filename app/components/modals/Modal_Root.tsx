'use client'

import AddToSbModal from './Ats'
import DelAcc from './DelAcc'
import CreateSoundboardModal from './CreateSoundboard'
import DelSound from './DelSound'
import ReportModal from './Report'
import EditSound from './EditSound'
import DownloadModal from './Download'
import ShareModal from './Share'

export default function Modal_Root() {
  return (
    <>
      <AddToSbModal />
      <DelAcc />
      <CreateSoundboardModal />
      <DelSound />
      <ReportModal />
      <EditSound />
      <DownloadModal />
      <ShareModal />
    </>
  )
}
