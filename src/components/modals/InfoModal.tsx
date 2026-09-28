import { type FunctionComponent } from 'preact'
import Modal from '.'
import Icon from '../Icon'

export const INFO_MODAL_ID = 'info'

const InfoModal: FunctionComponent = () => (
  <Modal name={INFO_MODAL_ID} title='About'>
    <div className="text-lg/6">
      <p className="mb-2">
        Welcome to <strong>⛑ Triage Simulator</strong>! This app allows you to
        learn and gain familiarity with triage protocols for mass casualty
        incidents. It uses the NHS Triage &amp; Scoring Tool (TST).
      </p>
      <h3 className="text-2xl font-black mt-4 mb-2">How it works</h3>
      <ol className="mb-2 pl-2 list-disc list-inside">
        <li>
          Use <strong><Icon n="add" className='text-xl/6 align-bottom' /> New
            disaster</strong> to generate a new set of patients. You can always
          use <strong><Icon n="restart_alt" className='text-xl/6 align-bottom' /> New
          game</strong> to get another one
        </li>
        <li>
          Your patient list displays your patients. Click on a patient to open
          their triage tag. Once you have assigned a code to a patient, its
          colour will update to reflect your choice
        </li>
        <li>
          Review the patient findings on the triage tag and assign a priority.
          Not breathing is Silver. Otherwise, can walk is P3 (Green); age under
          2, severe bleeding, not talking, or talking with a penetrating torso
          injury to the neck, chest, armpits, back, abdomen, groin, or buttocks
          is P1 (Red); all other patients are P2 (Yellow). For severe bleeding,
          apply pressure, a tourniquet, or packing.
        </li>
        <li>
          You can use <Icon n="visibility" className='text-xl/6 align-bottom' /> in
          the patient list to show which patients have been correctly
          triaged and to show individual feedback on each patient under their
          triage tag
        </li>
        <li>
          Use <Icon n="show_chart" className='text-xl/6 align-bottom' /> to
          display statistics such as the levels of over and under-triage
        </li>
      </ol>
      <h3 className="text-2xl font-black mt-4 mb-2">About the project</h3>
      <p className="mb-2">
        Triage Simulator is an open source project, you can find the code and
        report issues in the <a className="underline underline-offset-2" href="https://github.com/ALCC01/triage-simulator">Github repository</a>.
        You are currently running version {APP_VERSION} at commit {COMMIT_HASH}.
      </p>
      <p className="mb-2">
        Copyright © 2023 Alberto Coscia. Released under the GNU Affero General
        Public License v3.0 or later. Made in 🇪🇺 Italy, Europe.
      </p>
    </div>
  </Modal>
)

export default InfoModal
