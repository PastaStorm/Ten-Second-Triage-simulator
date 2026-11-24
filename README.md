# Ten Second Triage Tool

Ten Second Triage Tool is a simple web app that allows healthcare workers, emergency responders, and non-clinical responders to learn and become familiar with triage protocols for mass casualty incidents. The project aims to provide users with a readily available tool to test and refresh their triage skills. The app uses the NHS Ten Second Triage (TST) tool, with P1 (Red), P2 (Yellow), P3 (Green), and Not Breathing (Silver) categories.

Adapted by PastaStorm, 2026, for the NHS Ten Second Triage (TST) tool.

You can see the live deployment [here](https://workers.dev).

## Installation

```bash
git clone https://github.com
cd Ten-Second-Triage-simulator
npm install
```

## Building

```bash
npm run build
```

## Hosting

You can run a development server using `npm run dev`. Use `npm run preview` to serve the build artifacts from the `dist` folder in a production-like environment.

Production builds sit behind a web server or deploy to a static site hosting platform such as Cloudflare Workers & Pages.

## License

Copyright (C) 2023 Alberto Coscia <inbox@albertocoscia.me>  
Modifications Copyright (C) 2026 PastaStorm

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://gnu.org>.
