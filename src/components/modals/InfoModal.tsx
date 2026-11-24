import { type FunctionComponent } from 'preact'
import Modal from '.'
import Icon from '../Icon'

export const INFO_MODAL_ID = 'info'

const InfoModal: FunctionComponent = () => (
  <Modal name={INFO_MODAL_ID} title='About'>
    <div className="text-lg/6">
      <p className="mb-2">
        Welcome to <strong>NHS TST Simulator</strong>! This app allows you to
        learn and gain familiarity with triage protocols for mass casualty
        incidents. It uses the NHS Ten Second Triage (TST) tool.
      </p>
      <p className="mb-2">
        For the TST Tool{' '}
        <a
          className="underline underline-offset-2"
          href="https://england.nhs.uk"
          target="_blank"
          rel="noopener noreferrer"
        >
          click here
        </a>.
      </p>
      <h3 className="text-2xl font-black mt-4 mb-2">How it works</h3>
      <ol className="mb-2 pl-2 list-disc list-inside">
        <li>
          Use <strong><Icon n="add" className='text-xl/6 align-bottom' /> New
            disaster</strong> to generate a new set of casualties. You can always
          use <strong><Icon n="restart_alt" className='text-xl/6 align-bottom' /> New
          game</strong> to get another one.
        </li>
        <li>
          Your casualty list displays your casualties. Click on a casualty dot to open
          their triage tag. Once you have assigned a code to a casualty, its
          colour will update to reflect your choice.
        </li>
        <li>
          Review the casualty characteristics on the triage tag, treat appropriately and assign a priority.
        </li>
        <li>
          Not breathing is Silver. Severe bleeding, age under 2, not talking, or talking with a
          penetrating torso injury is P1 (Red); can walk is P3 (Green); all other casualties are P2 (Yellow).
        </li>
        <li>
          Appropriate treatments are any required immediate actions: apply pressure, a
          tourniquet, or packing for severe bleeding; place non-talking
          breathing casualties in the recovery position; or recovery position/perform CPR if not
          breathing (as resources allow).
        </li>
        <li>
          You can use <Icon n="visibility" className='text-xl/6 align-bottom' /> in
          the casualty list to show which casualties have been correctly
          triaged and to show individual feedback on each casualty under their
          triage tag.
        </li>
      </ol>
      <h3 className="text-2xl font-black mt-4 mb-2">About the project</h3>
      <p className="mb-2">
        NHS TST Simulator is an open source project, you can find the code and
        report issues or leave feedback in the{' '}
        <a
          className="underline underline-offset-2"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github repository
        </a>.
        You are currently running version {COMMIT_HASH}.
      </p>
      <p className="mb-2">
        Copyright © 2023 Alberto Coscia. Released under the GNU Affero General
        Public License v3.0 or later. Made in 🇪🇺 Italy, Europe.
      </p>
    </div>
  </Modal>
)

export default InfoModal
