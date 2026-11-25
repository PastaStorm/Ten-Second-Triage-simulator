import { type FunctionComponent } from 'preact'
import Modal from '.'
import Icon from '../Icon'

export const INFO_MODAL_ID = 'info'

const InfoModal: FunctionComponent = () => (
  <Modal name={INFO_MODAL_ID} title='About'>
    <div className="text-lg/6">
      <p className="mb-2">
        Welcome to <strong>NHS TST Simulator</strong>! This tool helps you
        practise and build familiarity with mass casualty triage using the NHS
        Ten Second Triage (TST) protocol.
      </p>
      <p className="mb-2">
        View the official NHS England{' '}
        <a
          className="underline underline-offset-2"
          href="https://england.nhs.uk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ten Second Triage (TST) tool
        </a>.
      </p>
      <h3 className="text-2xl font-black mt-4 mb-2">How it works</h3>
      <ol className="mb-2 pl-2 list-disc list-inside">
        <li>
          Click <strong><Icon n="add" className='text-xl/6 align-bottom' /> New
          disaster</strong> (or <strong><Icon n="restart_alt" className='text-xl/6 align-bottom' /> New
          disaster</strong> in the top toolbar) to generate a new set of casualties.
        </li>
        <li>
          Select any dot in the casualty list to open that casualty’s triage
          tag. Once you assign a priority, the dot’s colour updates to reflect
          your choice.
        </li>
        <li>
          Follow the TST flowchart to assess each casualty’s characteristics,
          perform any required life-saving interventions, and assign a priority.
        </li>
        <li>
          <strong>Priority categories:</strong> Not breathing is{' '}
          <strong>Not Breathing (Silver)</strong>; severe bleeding, not talking,
          or talking with a penetrating torso injury is <strong>P1 (Red)</strong>;
          walking is <strong>P3 (Green)</strong>; all other casualties are{' '}
          <strong>P2 (Yellow)</strong>.
        </li>
        <li>
          <strong>Key exceptions:</strong> As outlined in the{' '}
          <a
            className="underline underline-offset-2"
            href="https://england.nhs.uk"
            target="_blank"
            rel="noopener noreferrer"
          >
            NARU TST Non-Clinical Responders Supplementary Information
          </a>
          , walking casualties with severe bleeding must be sat down and
          triaged as <strong>P1 (Red)</strong>, and all children under 2 years
          old are automatically triaged as <strong>P1 (Red)</strong>.
        </li>
        <li>
          <strong>Immediate actions:</strong> Apply direct pressure, a
          tourniquet, or wound packing for severe bleeding; place non-talking
          casualties in the recovery position; and perform CPR if not breathing
          (as resources allow).
        </li>
        <li>
          Use <Icon n="visibility" className='text-xl/6 align-bottom' /> in the
          casualty list to reveal your results and view individual clinical
          feedback beneath each triage tag.
        </li>
      </ol>
      <h3 className="text-2xl font-black mt-4 mb-2">About the project</h3>
      <p className="mb-2">
        NHS TST Simulator is an open-source project. You can view the source
        code, report issues, or leave feedback in the{' '}
        <a
          className="underline underline-offset-2"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
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
